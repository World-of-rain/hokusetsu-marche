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
    <div className="mb-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] font-bold transition-colors ${
            open
              ? "border-ink bg-ink text-paper"
              : "border-ink/25 text-ink-soft hover:border-ink hover:text-ink"
          }`}
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
            <path
              d="M4 7h10M18 7h2M4 17h4M12 17h8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="16" cy="7" r="2" stroke="currentColor" strokeWidth="2" />
            <circle cx="10" cy="17" r="2" stroke="currentColor" strokeWidth="2" />
          </svg>
          {label}
        </button>
      </div>
      {open && (
        <div className="fade-in mt-3 rounded-2xl border rule bg-paper-light p-4">
          <div className="flex flex-wrap gap-2">
            {options.map((name) => {
              const on = selected.includes(name);
              return (
                <button
                  type="button"
                  key={name}
                  onClick={() => toggle(name)}
                  aria-pressed={on}
                  className={`rounded-full border px-3 py-1.5 text-[12px] font-bold transition-colors ${
                    on
                      ? "border-leaf bg-leaf text-white"
                      : "border-ink/20 text-ink-soft hover:border-ink"
                  }`}
                >
                  {on ? "✓ " : ""}
                  {name}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-[11px] text-ink-mute">
            選んだ内容はこの端末に保存され、次回も同じ表示になります。
          </p>
        </div>
      )}
    </div>
  );
}
