'use client';

import { useMemo } from 'react';
import { Dream } from '@/types/dream';
import { DayCarousel } from '@/components/dream/DayCarousel';
import { DreamForm } from '@/components/dream/DreamForm';
import { DreamCard, DreamCardSkeleton } from '@/components/dream/DreamCard';
import { Moon } from 'lucide-react';
import { useDreams } from '@/hooks/useDreams';
import { useAnalysis } from '@/hooks/useAnalysis';
import { useSettings } from '@/hooks/useSettings';
import { startOfDay, format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function Home() {
  const { dreams, loading, selectedDate, setSelectedDate, addDream, removeDream, getLastDaysWithDreams } = useDreams();
  const { analyze, analyzing: analyzingDream } = useAnalysis();
  const { getApiKey } = useSettings();
  
  const filteredDreams = useMemo(() => {
    if (selectedDate) {
      const start = startOfDay(selectedDate);
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);
      
      return dreams.filter(dream => 
        dream.date >= start && dream.date <= end
      );
    }
    return dreams;
  }, [selectedDate, dreams]);

  const handleAddDream = async (content: string, date: Date) => {
    const apiKey = getApiKey();
    if (!apiKey) {
      alert('Пожалуйста, добавьте API ключ в переменные окружения (NEXT_PUBLIC_OPENROUTER_API_KEY)');
      return;
    }

    try {
      const analysis = await analyze(content, apiKey);
      
      const newDream: Dream = {
        id: Date.now().toString(),
        date: date,
        content,
        analysis,
        createdAt: new Date()
      };

      await addDream(newDream);
      
      if (!selectedDate) {
        setSelectedDate(date);
      }
    } catch (error) {
      console.error('Failed to add dream:', error);
      throw error;
    }
  };

  const handleDeleteDream = async (id: string) => {
    await removeDream(id);
  };

  const lastDays = getLastDaysWithDreams(60);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col">
        <header className="sticky top-0 z-10 bg-[#faf8f5]/95 backdrop-blur-sm border-b border-[#e8e4df] flex-shrink-0">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="w-6 h-6 text-[#5c5855]" />
              <h1 className="font-serif text-2xl font-semibold text-[#2c2825]">
                Сонник
              </h1>
            </div>
          </div>
        </header>

        <DayCarousel
          days={lastDays}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        <main className="flex-1 p-6">
          <div className="space-y-6">
            <DreamForm onSubmit={handleAddDream} loading={analyzingDream} selectedDate={selectedDate} />

            <div className="space-y-4">
              {loading ? (
                <div className="space-y-4">
                  <DreamCardSkeleton />
                  <DreamCardSkeleton />
                </div>
              ) : filteredDreams.length === 0 ? (
                <div className="text-center py-12">
                  <Moon className="w-16 h-16 text-[#d4cfc7] mx-auto mb-4" />
                  <p className="text-[#8a857f] font-serif text-lg mb-2">
                    {selectedDate
                      ? `Нет снов за ${format(selectedDate, 'd MMMM', { locale: ru })}`
                      : 'Запишите свой первый сон'
                    }
                  </p>
                  <p className="text-sm text-[#a8a3a0]">
                    {selectedDate ? 'Выберите другой день или запишите новый сон' : 'Опишите свой сон выше'}
                  </p>
                </div>
              ) : (
                filteredDreams.map((dream) => (
                  <DreamCard
                    key={dream.id}
                    dream={dream}
                    onDelete={handleDeleteDream}
                  />
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
