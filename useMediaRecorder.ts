import { useState, useCallback, useRef } from 'react';

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError(err instanceof Error ? err.message : 'Permission denied');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  }, [isRecording]);

  const clearRecording = useCallback(() => {
    setAudioUrl(null);
    setError(null);
  }, []);

  return { isRecording, audioUrl, error, startRecording, stopRecording, clearRecording };
}

export function useVideoRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const videoChunks = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      videoChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        videoChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const videoBlob = new Blob(videoChunks.current, { type: 'video/webm' });
        const url = URL.createObjectURL(videoBlob);
        setVideoUrl(url);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing camera/microphone:', err);
      setError(err instanceof Error ? err.message : 'Permission denied');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  }, [isRecording]);

  const clearRecording = useCallback(() => {
    setVideoUrl(null);
    setError(null);
  }, []);

  return { isRecording, videoUrl, error, startRecording, stopRecording, clearRecording };
}
