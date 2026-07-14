import './OutdatedNotice.css';

const noticeText = 'This portfolio is currently outdated • A new portfolio is being made • Stay tuned!';

const OutdatedNotice = () => {
  return (
    <div className="outdated-notice-wrapper">
      <div className="outdated-notice-banner" aria-label="Portfolio update notice">
        <div className="outdated-notice-track">
          <div className="outdated-notice-content">
            <span className="notice-icon">⚠️</span>
            <span className="notice-text">{noticeText}</span>
            <span className="notice-icon">⚠️</span>
          </div>
          <div className="outdated-notice-content" aria-hidden="true">
            <span className="notice-icon">⚠️</span>
            <span className="notice-text">{noticeText}</span>
            <span className="notice-icon">⚠️</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutdatedNotice;
