import './OutdatedNotice.css';

const OutdatedNotice = () => {
  return (
    <div className="outdated-notice-wrapper">
      <div className="outdated-notice-banner">
        <div className="outdated-notice-content">
          <span className="notice-icon">⚠️</span>
          <span className="notice-text">
            This portfolio is currently outdated • A new portfolio is being made • Stay tuned!
          </span>
          <span className="notice-icon">⚠️</span>
        </div>
      </div>
    </div>
  );
};

export default OutdatedNotice;
