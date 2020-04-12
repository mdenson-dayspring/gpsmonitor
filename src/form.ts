import blessed = require('blessed');
import fs = require('fs');
// Screen
const screen = blessed.screen({
  smartCSR: true,
  title: 'Blessed form'
});
// Form
const form = blessed.form({
  keys: true,
  left: 'center',
  parent: screen,
  vi: true,
  width: '90%'
});
// Text boxes
const label1 = blessed.text({
  content: 'FIRST NAME:',
  left: 5,
  parent: screen,
  top: 3
});
const firstName = blessed.textbox({
  border: {
    type: 'line'
  },
  content: 'first',
  focus: {
    fg: 'blue'
  },
  height: 3,
  inputOnFocus: true,
  left: 5,
  name: 'firstname',
  parent: form,
  top: 4
});
const label2 = blessed.text({
  content: 'LAST NAME:',
  left: 5,
  parent: screen,
  top: 8
});
const lastName = blessed.textbox({
  border: {
    type: 'line'
  },
  content: 'last',
  focus: {
    fg: 'blue'
  },
  height: 3,
  inputOnFocus: true,
  left: 5,
  name: 'lastname',
  parent: form,
  top: 9
});
// Check boxes
const label3 = blessed.text({
  content: 'What are your favorite editors?',
  left: 5,
  parent: screen,
  top: 14
});
const vim = blessed.checkbox({
  content: 'Vim',
  left: 5,
  name: 'editors',
  parent: form,
  top: 16
});
const emacs = blessed.checkbox({
  content: 'Emacs',
  left: 20,
  name: 'editors',
  parent: form,
  top: 16
});
const atom = blessed.checkbox({
  content: 'Atom',
  left: 35,
  name: 'editors',
  parent: form,
  top: 16
});
const brackets = blessed.checkbox({
  content: 'Brackets',
  left: 50,
  name: 'editors',
  parent: form,
  top: 16
});
// // Radio buttons
// const label4 = blessed.text({
//   content: 'Do you like Blessed?',
//   left: 5,
//   parent: screen,
//   top: 19
// });
// const radioset = blessed.radioset({
//   height: 5,
//   parent: form,
//   top: 21,
//   width: '100%',
// });
// const yes = blessed.radiobutton({
//   content: 'Yes',
//   left: 5,
//   name: 'like',
//   parent: radioset
// });
// const no = blessed.radiobutton({
//   content: 'No',
//   left: 15,
//   name: 'like',
//   parent: radioset
// });
// // Text area
// const label5 = blessed.text({
//   content: 'Your comments...',
//   left: 5,
//   parent: screen,
//   top: 24
// });
// const textarea = blessed.textarea({
//   border: {
//     type: 'line'
//   },
//   height: 3,
//   inputOnFocus: true,
//   left: 5,
//   name: 'comments',
//   parent: form,
//   top: 26
// });
// Submit/Cancel buttons
const submit = blessed.button({
  content: 'Submit',
  left: 5,
  name: 'submit',
  padding: {
    bottom: 1,
    left: 2,
    right: 2,
    top: 1
  },
  parent: form,
  shrink: true,
  style: {
    bg: 'green',
    bold: true,
    fg: 'white',
    focus: {
      inverse: true
    }
  },
  top: 35
});
const reset = blessed.button({
  content: 'Reset',
  left: 15,
  name: 'reset',
  padding: {
    bottom: 1,
    left: 2,
    right: 2,
    top: 1
  },
  parent: form,
  shrink: true,
  style: {
    bg: 'red',
    bold: true,
    fg: 'white',
    focus: {
      inverse: true
    }
  },
  top: 35
});
// Info
const msg = blessed.message({
  left: 5,
  parent: screen,
  style: {
    fg: 'green',
    italic: true
  },
  top: 40
});
const table = blessed.table({
  content: '',
  hidden: true,
  left: 'center',
  parent: screen,
  style: {
    fg: 'green',
    header: {
      bg: 'blue',
      bold: true,
      fg: 'white'
    }
  },
  top: 40
});
// Event management
submit.on('press', () => {
  form.submit();
});
reset.on('press', () => {
  form.reset();
});
form.on(
  'submit',
  (data: { editors: string[]; firstname: string; lastname: string; like: boolean[]; comments: string }) => {
    const editors = ['Vim', 'Emacs', 'Atom', 'Brackets'].filter((item, index) => {
      return data.editors[index];
    });
    msg.display('Form submitted!', () => {
      let summary = '';
      summary += data.firstname + ' ' + data.lastname + '\n';
      summary += '------------------------------\n';
      summary += 'Favorite editors: ' + editors + '\n';
      summary += 'Likes Blessed: ' + data.like[0] + '\n';
      summary += 'Comments: ' + data.comments;
      fs.writeFile('form-data.txt', summary, err => {
        if (err) {
          throw err;
        }
      });
    });
  }
);
form.on('reset', () => {
  msg.display('Form cleared!', () => '');
});
// Key bindings
screen.key('q', () => {
  screen.destroy();
});
// Render everything!
screen.render();
