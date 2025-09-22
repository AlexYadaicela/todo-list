import styled from 'styled-components';

function TextInputWithLabel({ elementId, labelText, value, ref, onChange }) {
  return (
    <>
      <label htmlFor={elementId}>{labelText}</label>
      <input
        type="text"
        value={value}
        ref={ref}
        id={elementId}
        onChange={onChange}
      />
    </>
  );
}

export default TextInputWithLabel;
