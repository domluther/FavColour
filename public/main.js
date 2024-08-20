const submitBtn = document.querySelector('#colourForm button');
const colourList = document.querySelector('.colourList');

colourList.addEventListener('click', handleColourListClick);

async function handleColourListClick(e) {
  // Guard clauses
  if (e.target.classList.contains('votes')) return;
  if (e.target.classList.contains('colourName')) return;
  if (e.target.classList.contains('colour')) return;
  try {
    const colour = e.target.ariaLabel.split(' ')[1];
    if (e.target.classList.contains('delete')) {
      handleDelete(colour);
    }
    if (e.target.classList.contains('upvote')) {
      handleVote(colour, 'up');
    }
    if (e.target.classList.contains('downvote')) {
      handleVote(colour, 'down');
    }
  } catch (error) {
    const errorMsg = `Network error ${error}`;
    console.error(errorMsg);
    setNotification(errorMsg);
  }
}

async function handleDelete(colour) {
  const res = await fetch(`/colour/${colour}`, { method: 'DELETE' });
  if (res.ok) {
    setNotification(`Deleted ${colour}`, false);
    // Lower server load than EJS
    render();
  } else {
    const errorData = await res.json();
    const errorMsg = `Error deleting ${colour} : ${errorData.error}`;
    setNotification(errorMsg);
  }
}

async function handleVote(colour, direction) {
  const res = await fetch(`/colour/${colour}/${direction}`, {
    method: 'PUT',
  });
  if (res.ok) {
    // location.reload();
    // Lower server load than EJS
    render();
    setNotification('Voted', false);
  } else {
    const errorData = await res.json();
    const errorMsg = `Error upvoting ${colour} : ${errorData.error}`;
    console.error(errorMsg);
    setNotification(errorMsg);
  }
}

// No need to handle the submit button, just use an action and render it - does refreshing however
submitBtn.addEventListener('click', handleSubmit);

async function handleSubmit(e) {
  e.preventDefault();
  const colourInpEle = document.querySelector('#colourInput');
  const colour = colourInpEle.value.toLowerCase();
  const validColors = [
    'aliceblue',
    'antiquewhite',
    'aqua',
    'aquamarine',
    'azure',
    'beige',
    'bisque',
    'black',
    'blanchedalmond',
    'blue',
    'blueviolet',
    'brown',
    'burlywood',
    'cadetblue',
    'chartreuse',
    'chocolate',
    'coral',
    'cornflowerblue',
    'cornsilk',
    'crimson',
    'cyan',
    'darkblue',
    'darkcyan',
    'darkgoldenrod',
    'darkgray',
    'darkgreen',
    'darkkhaki',
    'darkmagenta',
    'darkolivegreen',
    'darkorange',
    'darkorchid',
    'darkred',
    'darksalmon',
    'darkseagreen',
    'darkslateblue',
    'darkslategray',
    'darkturquoise',
    'darkviolet',
    'deeppink',
    'deepskyblue',
    'dimgray',
    'dodgerblue',
    'firebrick',
    'floralwhite',
    'forestgreen',
    'fuchsia',
    'gainsboro',
    'ghostwhite',
    'gold',
    'goldenrod',
    'gray',
    'green',
    'greenyellow',
    'honeydew',
    'hotpink',
    'indianred',
    'indigo',
    'ivory',
    'khaki',
    'lavender',
    'lavenderblush',
    'lawngreen',
    'lemonchiffon',
    'lightblue',
    'lightcoral',
    'lightcyan',
    'lightgoldenrodyellow',
    'lightgray',
    'lightgreen',
    'lightpink',
    'lightsalmon',
    'lightseagreen',
    'lightskyblue',
    'lightslategray',
    'lightsteelblue',
    'lightyellow',
    'lime',
    'limegreen',
    'linen',
    'magenta',
    'maroon',
    'mediumaquamarine',
    'mediumblue',
    'mediumorchid',
    'mediumpurple',
    'mediumseagreen',
    'mediumslateblue',
    'mediumspringgreen',
    'mediumturquoise',
    'mediumvioletred',
    'midnightblue',
    'mintcream',
    'mistyrose',
    'moccasin',
    'navajowhite',
    'navy',
    'oldlace',
    'olive',
    'olivedrab',
    'orange',
    'orangered',
    'orchid',
    'palegoldenrod',
    'palegreen',
    'paleturquoise',
    'palevioletred',
    'papayawhip',
    'peachpuff',
    'peru',
    'pink',
    'plum',
    'powderblue',
    'purple',
    'red',
    'rosybrown',
    'royalblue',
    'saddlebrown',
    'salmon',
    'sandybrown',
    'seagreen',
    'seashell',
    'sienna',
    'silver',
    'skyblue',
    'slateblue',
    'slategray',
    'snow',
    'springgreen',
    'steelblue',
    'tan',
    'teal',
    'thistle',
    'tomato',
    'turquoise',
    'violet',
    'wheat',
    'white',
    'whitesmoke',
    'yellow',
    'yellowgreen',
  ];

  if (validColors.includes(colour)) {
    const res = await fetch('/colour/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({ colour }),
    });
    if (res.ok) {
      setNotification(`Added ${colour}`, false);
      colourInpEle.value = '';
      render();
    } else {
      const data = await res.json();
      const errorMsg = `${data.error}`;
      console.error(errorMsg);
      setNotification(errorMsg);
    }
  } else {
    if (colour === '') {
      const errorMsg = `Please pick a colour before adding.`;
      console.error(errorMsg);
      setNotification(errorMsg);
    } else {
      const errorMsg = `${colour} is not a valid HTML color name.`;
      console.error(errorMsg);
      setNotification(errorMsg);
    }
  }
}

function setNotification(msg, error = true) {
  notificationEle = document.querySelector('.notification');
  notificationEle.classList.remove('hidden');
  notificationEle.innerText = msg;
  if (error) {
    notificationEle.classList.add('error');
    notificationEle.classList.remove('info');
  } else {
    notificationEle.classList.add('info');
    notificationEle.classList.remove('error');
  }
  // Make it disappear after 2500ms
  setTimeout(() => notificationEle.classList.add('hidden'), 2500);
}

async function render() {
  console.log('Rendering page');
  const res = await fetch('/colour');
  const data = await res.json();
  const { colours } = data;
  const colourList = document.querySelector('.colourList');
  colourList.innerHTML = '';
  colours.forEach((colour) => {
    colourList.insertAdjacentHTML(
      'afterbegin',
      `<li class="colour" style="background-color:${colour.name};">
            <span class="colourName">${colour.name}</span>
            <span class="votes">${colour.votes}</span>
            <button class="upvote" aria-label="Upvote ${colour.name}">👍</button>
            <button class="downvote" aria-label="Upvote ${colour.name}">👎</button>
            <button class="delete" aria-label="Delete ${colour.name}">🗑️</button>
          </li>`
    );
  });
}

// Renders - can use instead of reloading
// render();

// setNotification();
