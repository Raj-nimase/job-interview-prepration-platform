// Heights for a natural-looking wave shape (percentages of container)
const BAR_HEIGHTS = [
  20, 35, 55, 70, 85, 65, 90, 75, 55, 80, 95, 70, 50, 85, 65, 40, 75, 90, 60,
  45, 80, 95, 70, 55, 85, 65, 40, 75, 90, 60, 50, 80, 70, 45, 85, 60, 75, 90,
  55, 65, 80, 40, 70, 55, 85, 60, 35, 20,
];

export function WaveformVisualizer({ isRecording }) {
  return (
    <div className="w-full h-16 flex items-center justify-center gap-[3px] px-2 rounded-lg bg-emerald-500/5">
      {BAR_HEIGHTS.map((h, i) => (
        <span
          key={i}
          className={`rounded-full flex-shrink-0 transition-all duration-300 ${
            isRecording ? "bg-emerald-400 animate-wave" : "bg-emerald-500/25"
          }`}
          style={{
            width: 3,
            height: isRecording ? `${h}%` : "4px",
            animationDelay: isRecording ? `${(i * 30) % 600}ms` : undefined,
          }}
        />
      ))}

      <style>{`
        @keyframes wave {
          0%, 100% { transform: scaleY(0.4); opacity: 0.5; }
          50%       { transform: scaleY(1);   opacity: 1;   }
        }
        .animate-wave {
          animation: wave 900ms ease-in-out infinite;
          transform-origin: center;
        }
      `}</style>
    </div>
  );
}
