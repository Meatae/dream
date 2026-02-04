'use client';

import { useState } from 'react';
import { Dream } from '@/types/dream';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { AnalysisView } from './AnalysisView';

interface DreamCardProps {
  dream: Dream;
  onDelete: (id: string) => void;
}

export function DreamCard({ dream, onDelete }: DreamCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const time = format(dream.createdAt, 'HH:mm', { locale: ru });

  return (
    <div className="space-y-3">
      <Card className={`
        bg-white border-[#e8e4df] shadow-sm transition-all duration-200
        ${expanded ? 'shadow-md' : ''}
      `}>
        <div className="p-4">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-[#2c2825]">{time}</span>
                {dream.analysis && (
                  <Badge variant="outline" className="border-[#d4cfc7] text-[#8a857f] text-xs">
                    ✨ Проанализирован
                  </Badge>
                )}
              </div>
              <p className="text-[#5c5855] line-clamp-3 leading-relaxed">
                {dream.content}
              </p>
            </div>
            
            <div className="flex items-center gap-1 flex-shrink-0">
              {dream.analysis && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setExpanded(!expanded)}
                  className="h-8 w-8 text-[#8a857f] hover:text-[#2c2825]"
                >
                  {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDelete(!showDelete)}
                className={`h-8 w-8 transition-colors ${
                  showDelete ? 'text-red-600 hover:bg-red-50' : 'text-[#8a857f] hover:text-[#2c2825]'
                }`}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {showDelete && (
            <div className="flex items-center gap-2 pt-2 border-t border-[#e8e4df]">
              <span className="text-sm text-[#8a857f]">Удалить этот сон?</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(dream.id)}
                className="h-7 text-xs"
              >
                Удалить
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDelete(false)}
                className="h-7 text-xs border-[#d4cfc7] text-[#5c5855]"
              >
                Отмена
              </Button>
            </div>
          )}
        </div>
      </Card>

      {expanded && dream.analysis && (
        <div className="animate-in slide-in-from-top-2 duration-200">
          <AnalysisView analysis={dream.analysis} />
        </div>
      )}
    </div>
  );
}

export function DreamCardSkeleton() {
  return (
    <Card className="bg-white border-[#e8e4df] shadow-sm">
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-4 w-12 bg-[#e8e4df] rounded animate-pulse" />
          <div className="h-5 w-24 bg-[#e8e4df] rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-[#e8e4df] rounded animate-pulse" />
          <div className="h-4 bg-[#e8e4df] rounded animate-pulse w-3/4" />
          <div className="h-4 bg-[#e8e4df] rounded animate-pulse w-1/2" />
        </div>
      </div>
    </Card>
  );
}
