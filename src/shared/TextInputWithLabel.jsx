import styled from 'styled-components';

function TextInputWithLabel({ elementId, labelText, value, ref, onChange }) {
  const StyledInput = styled.input`
    padding-inline-end: 0.5rem;
  `;
  return (
    <>
      <label htmlFor={elementId}>{labelText}</label>
      <StyledInput
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
