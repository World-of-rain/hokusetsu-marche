import { useState } from "react";

type Props = {
  label: string; // ボタンの文言（例: "表示する品目を選ぶ"）
  options: string[]; // 選択肢（表示順のまま出す）
  selected: string[]; // 現在選択中
  onChange: (next: string[]) => void;
};

// セクションの表示内容（底値カレンダーの品目・ストック枠のカテゴリ）を
// ユーザーが選ぶための小さなトグルUI。選択状態は呼び出し側がlocalStorageに永続化する。
export default function SectionPicker({ label, options, selected, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const toggle = (name: string) =>
    onChange(selected.includes(name) ? selected.filter((s) => s !== name) : [...selected, name]);

  return (
    <div className="-mt-2 mb-3">
      <div className="flex justify-end">
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border transition-colors ${
            open
              ? "bg-stone-600 text-white border-stone-600"
              : "bg-white text-stone-400 border-stone-200 hover:text-stone-600"
          }`}
        >
          <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
            <path
              d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          {label}
        </button>
      </div>
      {open && (
        <div className="mt-2 p-2.5 bg-stone-50 rounded-xl border border-stone-100">
          <div className="flex flex-wrap gap-1.5">
            {options.map((name) => {
              const on = selected.includes(name);
              return (
                <button
                  key={name}
                  onClick={() => toggle(name)}
                  aria-pressed={on}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-colors ${
                    on
                      ? "bg-teal-500 text-white border-teal-500"
                      : "bg-white text-stone-400 border-stone-200"
                  }`}
                >
                  {on ? "✓ " : ""}
                  {name}
                </button>
              );
            })}
          </div>
          <p className="text-[9px] text-stone-400 mt-1.5">
            選んだ内容はこの端末に保存され、次回も同じ表示になります。
          </p>
        </div>
      )}
    </div>
  );
}
