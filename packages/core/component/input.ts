// todo replace props
export function Input() {
  return function (target: any, propertyName: string) {
    if (target.inputPropsList && target.inputPropsList.indexOf(propertyName) === -1) target.inputPropsList.push(propertyName);
    if (!target.inputPropsList) target.inputPropsList = [ propertyName ];
  };
}
