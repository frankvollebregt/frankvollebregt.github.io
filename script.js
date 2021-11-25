let stats = {};

window.onload = async () => {
    let response = await fetch('data.json');
    let data = await response.json();

    // place all values into the correct HTML fields
    for (let key of Object.keys(data)) {
        if (data[key] instanceof Array) {
            // append with font size depending on relative score
            let minScore = data[key][data[key].length - 1].score;
            let maxScore = data[key][0].score;
            let fontSizes = data[key].map((entry, index) => {
                return mapNumberToRange(entry.score, minScore, maxScore, 16, 28) + 'px';
            });

            // create and append list items
            let items = data[key].map((entry, index) => {
                let listItem = document.createElement('li');
                console.log('setting font size of', entry.tag, 'to', fontSizes[index]);
                listItem.style.fontSize = fontSizes[index];
                listItem.appendChild(document.createTextNode(entry.tag));
                return listItem;
            });

            items.forEach((item) => {
                document.getElementById(key).appendChild(item);
            });
        } else if (key.includes('url')) {
            document.getElementById(key).href = data[key];
        } else if (key === 'img') {
            // image is source
            document.getElementById('img').src = data[key];
        } else {
            // just set the inner text
            document.getElementById(key).innerText = data[key];
        }
    }

    // start the timer
    stats.title = data['ctx_title'];
    stats.startTime = new Date().getTime();
}

function revealOrHideAutomaticDescription() {
    const descriptionButton = document.getElementById('button-show-description');
    const caption = document.getElementById('img_caption');
    console.log('Toggling description!');
    caption.hidden = !caption.hidden;

    // set button text appropriately
    descriptionButton.innerText = caption.hidden ? 'Klik om te tonen' : 'Klik om te verbergen';

    // timestamp is only set the first time
    if (!stats.revealDescriptionTime) stats.revealDescriptionTime = new Date().getTime();
}

function showOrHideFullContext() {
    const contextButton = document.getElementById('button-show-context');
    const context = document.getElementById('ctx');
    console.log('Toggling context!');
    context.hidden = !context.hidden;

    // set button text appropriately
    contextButton.innerText = context.hidden ? 'Klik om te tonen' : 'Klik om te verbergen';

    // timestamp is only set the first time
    if (!stats.revealContextTime) stats.revealContextTime = new Date().getTime();
}

async function submitDescription() {
    let description = document.getElementById('user_description').value;
    if (!description || description.length < 2) {
        console.warn('Submitted description was not present or too short!');
        return;
    }

    document.getElementById('submit_button').className = "btn btn-success";

    console.log('Submitting description');
    stats.endTime = new Date().getTime();
    stats.description = description;

    // for now, display to the user
    console.log(stats);
    document.getElementById('result-object').hidden = false;
    document.getElementById('result-object').innerText = JSON.stringify(stats, undefined, 2);

    console.log('body is', JSON.stringify(stats));

    const body = JSON.stringify(stats);
    const response = await fetch('description', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: body,
        }
    );
    $.post({

    });

    return response;
}

// utility function to map numbers (for font size)
// retrieved from https://gist.github.com/xposedbones/75ebaef3c10060a3ee3b246166caab56
function mapNumberToRange(number, in_min, in_max, out_min, out_max) {
  return Math.round((number - in_min) * (out_max - out_min) / (in_max - in_min) + out_min);
}
