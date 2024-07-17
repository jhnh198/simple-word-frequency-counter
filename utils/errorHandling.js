export function errorMessage(message, componentId){
  let component = document.getElementById(componentId);
  component.classList.add('error');
  component.textContent = message;
}

export function clearErrorMessage(message, componentId){
  let component = document.getElementById(componentId);
  component.classList.remove('error');
  component.textContent = message;
}