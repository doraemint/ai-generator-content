import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Option {
  label: string;
  value: string;
}

interface SelectDropdownProps {
  options: Option[];
  defaultValue?: string;
  onSelect?: (value: string) => void;
}

export default function SelectDropdown({
  options,
  defaultValue,
  onSelect,
}: SelectDropdownProps) {
  const defaultOption =
    options.find((o) => o.value === defaultValue) || options[0];
  const [selected, setSelected] = useState<Option>(defaultOption);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelect = (option: Option) => {
    setSelected(option);
    onSelect?.(option.value);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={ref}>
      <button
        onClick={toggleDropdown}
        className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded-xl shadow-sm flex items-center justify-between text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-800 transition"
      >
        {selected.label}
        <ChevronDown className="h-4 w-4 ml-2" />
      </button>

      {isOpen && (
        <ul className="absolute z-50 mt-2 w-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-lg max-h-60 overflow-y-auto transition">
          {options.map((option) => (
            <li key={option.value}>
              <button
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-neutral-800 transition ${
                  selected.value === option.value
                    ? "bg-gray-100 dark:bg-neutral-800 font-semibold"
                    : ""
                }`}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
