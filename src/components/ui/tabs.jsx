import "../../styles/tabs.css";

export default function Tabs({ variant = "profile", tabs, active, onChange }) {
  return (
    <div className={`tabs tabs-${variant}`} role="tablist">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            className={`tabs-item text-label-m ${isActive ? "is-active" : ""}`}
            onClick={() => !isActive && onChange(tab.id)}
          >
            {tab.label}
            {tab.count != null && <span className="tabs-count text-label-s">{tab.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
