import './OutdatedNotice.css';

const OutdatedNotice = () => {
  return (
    <div className="outdated-notice-card" role="status" aria-live="polite">
      <div className="outdated-notice-header">
        <span className="notice-dot" />
        <span className="notice-title">System Outdated</span>
      </div>
      <p className="notice-message">
        This portfolio is currently outdated. A new portfolio is being created.
      </p>
    </div>
  );
};

export default OutdatedNotice;
