var ghpages = require('gh-pages');
ghpages.publish('dist', function(err) {
  if (err) {
    console.error('There was an error deploying gh-pages');
  } else {
    console.log('Deplyment successful!');
  }
});
