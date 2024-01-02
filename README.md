# Text Prediction Library

## Description

This JavaScript library provides real-time text prediction and word matching capabilities, enhancing the user's typing experience by suggesting relevant words and phrases as they type. It integrates seamlessly with HTML input fields and text areas, offering a visually appealing and user-friendly interface.

## Features

Predictive text suggestions: Offers a list of potential next words or phrases as the user types, aiding in faster and more accurate text input.
Word matching: Provides suggestions for alternative words or phrases based on the current word being typed, helping to improve accuracy and explore different writing possibilities.
Customizable appearance: The suggestion list can be styled to match your website's design for a seamless user experience.
Debug mode: Enables detailed logging for troubleshooting and development purposes.
## Usage

Include the library:

```HTML
<script src="https://zestlark.github.io/Text-predection-library/text-predection-library.js"></script>
```

Use code with caution. Learn more
Create a TextPredict object:

JavaScript
const tp = new TextPredict(elementSelector, debugMode);
Use code with caution. Learn more
elementSelector: The CSS selector of the input field or text area to apply the prediction feature to.
debugMode: Optional boolean flag to enable or disable debug mode (defaults to false).
## Example

```HTML
<input type="text" id="myInput">
<script>
  const tp = new TextPredict('#myInput');
</script>
```
Use code with caution. Learn more
## Additional Features

Disabling the debugger: To hide the debug element, set debugMode to false when creating the TextPredict object.
## API Endpoints

The library utilizes two API endpoints for its functionality:

```
https://unknownf331-test2.hf.space/word?text= for next word prediction
```
```
https://unknownf331-test2.hf.space/match?text= for word matching
```

## Additional Information

For a complete list of methods and properties, refer to the library's source code.
Consider contributing to the project or reporting any issues you encounter.
