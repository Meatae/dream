'use client';

import { DayWithDreams } from '@/types/dream';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

interface DayCarouselProps {
  days: DayWithDreams[];
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

export function DayCarousel({ days, selectedDate, onSelectDate }: DayCarouselProps) {
  if (days.length === 0) {
    return (
      <div className="border-b border-[#e8e4df] bg-[#faf8f5] py-4">
        <p className="text-center text-sm text-[#8a857f]">
          Запишите первый сон, чтобы увидеть календарь
        </p>
      </div>
    );
  }

  const selectedDateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;

  return (
    <div className="border-b border-[#e8e4df] bg-[#faf8f5]">
      <ScrollArea className="w-full">
        <div className="flex gap-3 p-4">
          {days.map((day) => {
            const isSelected = selectedDateStr === format(day.date, 'yyyy-MM-dd');
            const isToday = format(day.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
            
            return (
              <Button
                key={format(day.date, 'yyyy-MM-dd')}
                variant="ghost"
                onClick={() => onSelectDate(day.date)}
                className={`
                  flex-shrink-0 h-auto flex-col gap-1 py-3 px-4 min-w-[100px]
                  transition-all duration-200 relative
                  ${isSelected 
                    ? 'bg-[#2c2825] text-white shadow-lg' 
                    : 'bg-white text-[#5c5855] hover:bg-[#e8e4df]'
                  }
                  ${day.dreams.length > 0 ? 'ring-2 ring-[#d4cfc7]' : ''}
                `}
              >
                <span className="text-xs opacity-80">
                  {isToday ? 'Сегодня' : format(day.date, 'EEE', { locale: ru })}
                </span>
                <span className="text-lg font-semibold">
                  {format(day.date, 'd')}
                </span>
                <span className="text-xs opacity-80">
                  {format(day.date, 'MMMM', { locale: ru })}
                </span>
                {day.dreams.length > 0 && (
                  <>
                    <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-[#2c2825]'}`} />
                    <span className={`text-xs ${isSelected ? 'text-white/80' : 'text-[#8a857f]'}`}>
                      {day.dreams.length} {day.dreams.length === 1 ? 'сон' : day.dreams.length > 4 ? 'снов' : 'сна'}
                    </span>
                  </>
                )}
                {day.dreams.length === 0 && (
                  <span className="text-xs text-[#a8a3a0]">Нет снов</span>
                )}
              </Button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="h-2" />
      </ScrollArea>
    </div>
  );
}
