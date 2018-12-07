export type TInputProp = {
  propName: string;
  inputName: string;
};

export function Input(name?: string) {
  return function (target: any, propertyName: string) {
    const inputProp: TInputProp = {
      propName: name ? name : propertyName,
      inputName: propertyName,
    };
    if (target.inputPropsList && !target.inputPropsList.find((input: TInputProp) => input.propName === inputProp.propName)) target.inputPropsList.push(inputProp);
    if (!target.inputPropsList) target.inputPropsList = [ inputProp ];
  };
}
