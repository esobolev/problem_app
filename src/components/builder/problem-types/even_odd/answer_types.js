const AnswerRadioButtons = ({ items, answerTrue, handleAnswerChange }) => (
  <div className="row form-group">
    <div className="col-lg-2">
      <label className="col-form-label input-block">Answer true</label>
    </div>
    {items.map((item) => (
      <div
        key={item.value}
        className="radio col-lg-2"
        style={{ marginLeft: 20, marginTop: 5 }}
      >
        <div className="input-block">
          <input
            type="radio"
            name="answerTrue"
            value={item.value}
            onChange={handleAnswerChange(item.value)}
            checked={answerTrue === item.value}
          />
          <span className="radio-ico" />
          <p>{item.label}</p>
        </div>
      </div>
    ))}
  </div>
)

export { AnswerRadioButtons }
