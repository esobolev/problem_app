const Actions = ({ handleSave, isLoading = false }) => (
  <div className="block actions">
    {/* <button type="button" className="second-btn">Cancel</button> */}
    <button
      type="button"
      className="primary-btn"
      onClick={handleSave}
      disabled={isLoading}
    >
      {isLoading ? 'Saving...' : 'Save'}
    </button>
  </div>
)
export default Actions
