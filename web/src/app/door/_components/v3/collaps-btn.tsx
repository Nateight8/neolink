"use client";

interface CollapseButtonProps {
  collapsed: boolean;
  onClick: () => void;
}

export function CollapseButton({ collapsed, onClick }: CollapseButtonProps) {
  return (
    <button
      onClick={onClick}
      className="absolute left-[0px] top-[24px] w-[18px] h-[18px] rounded-full bg-[#272729] border border-[#343536] flex items-center justify-center z-10"
    >
      <div className="w-[8px] h-[1px] bg-gray-400"></div>
      {!collapsed && (
        <div className="w-[1px] h-[8px] bg-gray-400 absolute"></div>
      )}
    </button>
  );
}
