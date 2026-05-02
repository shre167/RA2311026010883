import { useState, useEffect } from 'react';

export const useReadState = () => {
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const stored = localStorage.getItem("read_notifications");
    if (stored) {
      try {
        setReadIds(new Set(JSON.parse(stored)));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const markAsRead = (id: string) => {
    setReadIds(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      localStorage.setItem("read_notifications", JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  const markAllAsRead = (ids: string[]) => {
    setReadIds(prev => {
      const newSet = new Set(prev);
      ids.forEach(id => newSet.add(id));
      localStorage.setItem("read_notifications", JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  }

  return { readIds, markAsRead, markAllAsRead };
};
