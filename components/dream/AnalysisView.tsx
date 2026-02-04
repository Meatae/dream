'use client';

import { DreamAnalysis } from '@/types/dream';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { User, MapPin, Lightbulb, Brain, TrendingUp, Heart } from 'lucide-react';

interface AnalysisViewProps {
  analysis: DreamAnalysis;
}

const AVATAR_EMOJIS = ['😀', '😐', '😢', '😡', '😨', '🥳', '😴', '🤔', '😇', '👻', '👽', '🧙', '👑', '🦸', '🧛', '🧟', '👶', '🧒', '👩', '🧔'];

const LOCATION_ICONS = {
  indoor: '🏠',
  outdoor: '🌳',
  abstract: '🌀',
  familiar: '💫'
};

const PATTERN_ICONS = {
  recurring: '🔄',
  symbolic: '🎭',
  emotional: '❤️'
};

export function AnalysisView({ analysis }: AnalysisViewProps) {
  return (
    <div className="w-full p-6 space-y-6">
          <section>
            <h3 className="text-lg font-semibold text-[#2c2825] mb-3 flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Суть сна
            </h3>
            <p className="text-[#5c5855] leading-relaxed break-words">{analysis.summary}</p>
          </section>

          <Separator className="bg-[#e8e4df]" />

          <section>
            <h3 className="text-lg font-semibold text-[#2c2825] mb-3 flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Эмоциональный тон
            </h3>
            <Badge variant="secondary" className="bg-[#e8e4df] text-[#2c2825] break-words">
              {analysis.mood}
            </Badge>
          </section>

          <Separator className="bg-[#e8e4df]" />

          {analysis.themes.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-[#2c2825] mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Темы
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.themes.map((theme, index) => (
                  <Badge key={index} variant="outline" className="border-[#d4cfc7] text-[#5c5855] break-words">
                    {theme}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {analysis.themes.length > 0 && <Separator className="bg-[#e8e4df]" />}

          {analysis.characters.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-[#2c2825] mb-3 flex items-center gap-2">
                <User className="w-5 h-5" />
                Персонажи
              </h3>
              <div className="grid gap-3">
                {analysis.characters.map((character, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-[#faf8f5] rounded-lg">
                    <Avatar className="h-10 w-10 flex-shrink-0 bg-[#e8e4df]">
                      <AvatarFallback className="text-lg">
                        {character.avatar || AVATAR_EMOJIS[index % AVATAR_EMOJIS.length]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-[#2c2825] break-words">{character.name}</h4>
                      <p className="text-sm text-[#8a857f] mb-1 break-words">{character.role}</p>
                      <p className="text-xs text-[#5c5855] leading-relaxed break-words">{character.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {analysis.characters.length > 0 && <Separator className="bg-[#e8e4df]" />}

          {analysis.locations.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-[#2c2825] mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Локации
              </h3>
              <div className="grid gap-3">
                {analysis.locations.map((location, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-[#faf8f5] rounded-lg">
                    <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center bg-[#e8e4df] rounded-full text-xl">
                      {LOCATION_ICONS[location.type] || '📍'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="font-medium text-[#2c2825] break-words">{location.name}</h4>
                        <Badge variant="outline" className="text-xs border-[#d4cfc7] text-[#8a857f]">
                          {location.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-[#5c5855] leading-relaxed break-words">{location.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {analysis.locations.length > 0 && <Separator className="bg-[#e8e4df]" />}

          {analysis.patterns.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-[#2c2825] mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Паттерны
              </h3>
              <div className="grid gap-3">
                {analysis.patterns.map((pattern, index) => (
                  <div key={index} className="p-3 bg-[#faf8f5] rounded-lg">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xl">{PATTERN_ICONS[pattern.type] || '🔮'}</span>
                      <h4 className="font-medium text-[#2c2825] break-words flex-1">{pattern.description}</h4>
                      <Badge variant="outline" className="text-xs border-[#d4cfc7] text-[#8a857f]">
                        {pattern.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-[#5c5855] leading-relaxed break-words">{pattern.significance}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {analysis.patterns.length > 0 && analysis.insights && <Separator className="bg-[#e8e4df]" />}

          {analysis.insights && (
            <section className="bg-[#faf8f5] p-4 rounded-lg border border-[#e8e4df]">
              <h3 className="text-lg font-semibold text-[#2c2825] mb-2 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Интерпретация
              </h3>
              <p className="text-sm text-[#5c5855] leading-relaxed italic break-words">
                {analysis.insights}
              </p>
            </section>
          )}
    </div>
  );
}
