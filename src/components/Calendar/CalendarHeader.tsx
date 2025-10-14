import type { FC } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/utils';

import { EViewType } from './types';

interface ICalendarHeaderProps {
    title: string;
    view: EViewType;
    onChangeView: (view: EViewType) => void;
    navigate: (direction: number) => void;
    onClickToday: (date: Date) => void;
}

export const CalendarHeader: FC<ICalendarHeaderProps> = ({ onChangeView, view, title, navigate, onClickToday }) => {
    return (
        <div className="bg-white p-2 md:p-4 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0">
            <div className="flex items-center gap-1 w-full md:w-1/3 justify-center md:justify-start order-2 md:order-1">
                <h1 className="text-lg md:text-xl font-bold text-gray-800 truncate">{title}</h1>
            </div>
            <div className="flex gap-1 md:gap-2 w-full md:w-1/3 justify-center order-1 md:order-2">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded">
                    <ChevronLeft size={20} />
                </button>
                <button
                    onClick={() => onClickToday(new Date())}
                    className="px-2 md:px-3 py-2 hover:bg-gray-100 rounded text-sm"
                >
                    Today
                </button>
                <button onClick={() => navigate(1)} className="p-2 hover:bg-gray-100 rounded">
                    <ChevronRight size={20} />
                </button>
            </div>
            <div className="flex gap-1 md:gap-2 w-full md:w-1/3 justify-center md:justify-end order-3">
                <button
                    onClick={() => onChangeView(EViewType.DAY)}
                    className={cn(`px-2 md:px-4 py-2 rounded text-sm bg-gray-200`, {
                        'bg-teal-600 text-white': view === EViewType.DAY,
                    })}
                >
                    <span className="hidden sm:inline">Day</span>
                    <span className="sm:hidden">D</span>
                </button>
                <button
                    onClick={() => onChangeView(EViewType.WEEK)}
                    className={cn(`px-2 md:px-4 py-2 rounded text-sm bg-gray-200`, {
                        'bg-teal-600 text-white': view === EViewType.WEEK,
                    })}
                >
                    <span className="hidden sm:inline">Week</span>
                    <span className="sm:hidden">W</span>
                </button>
                <button
                    onClick={() => onChangeView(EViewType.MONTH)}
                    className={cn(`px-2 md:px-4 py-2 rounded text-sm bg-gray-200`, {
                        'bg-teal-600 text-white': view === EViewType.MONTH,
                    })}
                >
                    <span className="hidden sm:inline">Month</span>
                    <span className="sm:hidden">M</span>
                </button>
            </div>
        </div>
    );
};
