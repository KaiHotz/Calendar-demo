import { type FC } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { EViewType } from './types';

interface ICalendarHeaderProps {
    dates: string;
    view: EViewType;
    onChangeView: (view: EViewType) => void;
    navigate: (direction: number) => void;
    onClickToday: (date: Date) => void;
}

export const CalendarHeader: FC<ICalendarHeaderProps> = ({ onChangeView, view, dates, navigate, onClickToday }) => {
    return (
        <div className="bg-white border-b p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800">{dates}</h1>
                <div className="flex gap-2">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded">
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => onClickToday(new Date())}
                        className="px-3 py-2 hover:bg-gray-100 rounded text-sm"
                    >
                        Today
                    </button>
                    <button onClick={() => navigate(1)} className="p-2 hover:bg-gray-100 rounded">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => onChangeView(EViewType.DAY)}
                    className={`px-4 py-2 rounded ${view === EViewType.DAY ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
                >
                    Day
                </button>
                <button
                    onClick={() => onChangeView(EViewType.WEEK)}
                    className={`px-4 py-2 rounded ${view === EViewType.WEEK ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
                >
                    Week
                </button>
                <button
                    onClick={() => onChangeView(EViewType.MONTH)}
                    className={`px-4 py-2 rounded ${view === EViewType.MONTH ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
                >
                    Month
                </button>
            </div>
        </div>
    );
};
