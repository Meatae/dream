import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon, Save } from 'lucide-react';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiKey: string;
  onSave: (apiKey: string) => void;
}

export function SettingsDialog({ open, onOpenChange, apiKey, onSave }: SettingsDialogProps) {
  const [key, setKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    onSave(key);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-[#faf8f5] border-[#e8e4df]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#2c2825]">
            <SettingsIcon className="w-5 h-5" />
            Настройки
          </DialogTitle>
          <DialogDescription className="text-[#5c5855]">
            Настройте API ключ для анализа снов
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#2c2825]">OpenRouter API Key</label>
            <div className="relative">
              <Input
                type={showKey ? 'text' : 'password'}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="sk-or-..."
                className="pr-10 bg-white border-[#d4cfc7]"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5c5855] hover:text-[#2c2825]"
              >
                {showKey ? '🙈' : '👁️'}
              </button>
            </div>
            <p className="text-xs text-[#8a857f]">
              Получите ключ на <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="underline">openrouter.ai</a>
            </p>
          </div>

          <Button onClick={handleSave} className="w-full bg-[#3d3a37] hover:bg-[#2c2825] text-white">
            <Save className="w-4 h-4 mr-2" />
            Сохранить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
