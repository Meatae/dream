import { useState, useEffect } from 'react';
import { Dream, DayWithDreams } from '@/types/dream';
import { getAllDreams, getDreamsByDate, saveDream, deleteDream, updateDream } from '@/lib/db/schema';
import { format, startOfDay, subDays } from 'date-fns';

export function useDreams() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    loadDreams();
  }, []);

  const loadDreams = async () => {
    setLoading(true);
    try {
      const allDreams = await getAllDreams();
      setDreams(allDreams.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    } catch (error) {
      console.error('Failed to load dreams:', error);
    } finally {
      setLoading(false);
    }
  };

  const addDream = async (dream: Dream) => {
    try {
      await saveDream(dream);
      setDreams(prev => [dream, ...prev].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    } catch (error) {
      console.error('Failed to save dream:', error);
      throw error;
    }
  };

  const removeDream = async (id: string) => {
    try {
      await deleteDream(id);
      setDreams(prev => prev.filter(d => d.id !== id));
    } catch (error) {
      console.error('Failed to delete dream:', error);
      throw error;
    }
  };

  const editDream = async (id: string, updates: Partial<Dream>) => {
    try {
      await updateDream(id, updates);
      setDreams(prev =>
        prev.map(d => (d.id === id ? { ...d, ...updates } : d))
      );
    } catch (error) {
      console.error('Failed to update dream:', error);
      throw error;
    }
  };

  const getDreamsForDate = async (date: Date): Promise<Dream[]> => {
    try {
      return await getDreamsByDate(date);
    } catch (error) {
      console.error('Failed to get dreams for date:', error);
      return [];
    }
  };

  const getLastDaysWithDreams = (days: number = 30): DayWithDreams[] => {
    const daysMap = new Map<string, Dream[]>();
    
    dreams.forEach(dream => {
      const dateKey = format(dream.date, 'yyyy-MM-dd');
      if (!daysMap.has(dateKey)) {
        daysMap.set(dateKey, []);
      }
      daysMap.get(dateKey)!.push(dream);
    });

    const result: DayWithDreams[] = [];
    for (let i = 0; i < days; i++) {
      const date = subDays(new Date(), i);
      const dateKey = format(date, 'yyyy-MM-dd');
      const daysDreams = daysMap.get(dateKey) || [];
      
      if (daysDreams.length > 0) {
        result.push({
          date: startOfDay(date),
          dreams: daysDreams.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        });
      }
    }
    
    return result;
  };

  return {
    dreams,
    loading,
    selectedDate,
    setSelectedDate,
    addDream,
    removeDream,
    editDream,
    getDreamsForDate,
    getLastDaysWithDreams,
    refreshDreams: loadDreams
  };
}
