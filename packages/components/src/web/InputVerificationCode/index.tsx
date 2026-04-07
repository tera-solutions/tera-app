import { useEffect, useRef, useState } from "react";

type InputVerificationCodeProps = {
  onChangeCode: (code: string) => void;
  reset?: boolean;
};
const InputVerificationCode = ({
  onChangeCode,
  reset,
}: InputVerificationCodeProps) => {
  const [code, setCode] = useState("");

  // Refs to control each digit input element
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  // Reset all inputs and clear state
  const resetCode = () => {
    inputRefs.forEach((ref) => {
      ref.current.value = "";
    });
    inputRefs[0].current.focus();
    setCode("");
  };

  // Call our callback when code = 6 chars
  useEffect(() => {
    onChangeCode?.(code);
    // resetCode();
  }, [code]);

  // Listen for external reset toggle
  useEffect(() => {
    resetCode();
  }, [reset]);

  // Handle input
  function handleInput(e, index) {
    const input = e.target;
    const previousInput = inputRefs[index - 1];
    const nextInput = inputRefs[index + 1];

    // Update code state with single digit
    const newCode = [...code];
    // Convert lowercase letters to uppercase
    if (/^[a-z]+$/.test(input.value)) {
      const uc = input.value.toUpperCase();
      newCode[index] = uc;
      inputRefs[index].current.value = uc;
    } else {
      newCode[index] = input.value;
    }
    setCode(newCode.join(""));

    input.select();

    if (input.value === "") {
      // If the value is deleted, select previous input, if exists
      if (previousInput) {
        previousInput.current.focus();
      }
    } else if (nextInput) {
      // Select next input on entry, if exists
      nextInput.current.select();
    }
  }

  // Select the contents on focus
  function handleFocus(e) {
    e.target.select();
  }

  // Handle backspace key
  function handleKeyDown(e, index) {
    const input = e.target;
    const previousInput = inputRefs[index - 1];

    if ((e.keyCode === 8 || e.keyCode === 46) && input.value === "") {
      e.preventDefault();
      setCode(
        (prevCode) => prevCode.slice(0, index) + prevCode.slice(index + 1),
      );
      if (previousInput) {
        previousInput.current.focus();
      }
    }
  }

  // Capture pasted characters
  const handlePaste = (e) => {
    const pastedCode = e.clipboardData.getData("text");
    if (pastedCode.length === 6) {
      setCode(pastedCode);
      inputRefs.forEach((inputRef, index) => {
        inputRef.current.value = pastedCode.charAt(index);
      });
    }
  };

  return (
    <div className="flex gap-2 relative">
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <input
          className="text-5xl py-[30px] w-[70px] border border-gray-200 text-center focus:ring focus:ring-blue-300 focus:border-blue-700 disabled:hover:border-gray-200 transition-all"
          key={index}
          type="text"
          maxLength={1}
          onChange={(e) => handleInput(e, index)}
          ref={inputRefs[index]}
          autoFocus={index === 0}
          onFocus={handleFocus}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
};

export default InputVerificationCode;
