const fs = require('fs');
const express = require('express');
const app = express();

app.use(express.json()); // middleware to parse the body of the request
// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello World form server side!', app: 'Natours' });
// });
// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint...');
// });

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
);

const createTour = (req, res) => {
  //console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body); // create a new object with the id and the body of the request

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
  //res.send('Done'); trying to send two responses will couse an error
};

const getTour = (req, res) => {
  //:id is a placeholder ie a variable
  console.log(req.params); //req.params is an object that contains all the parameters in the url i.e the id

  const id = req.params.id * 1; // * 1 is to convert the string to a number
  if (id > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }

  const tour = tours.find((el) => el.id === id);
  res.status(200).json({ status: 'success', data: { tour } });
};

const patchTour = (req, res) => {
  const id = req.params.id * 1; // * 1 is to convert the string to a number
  if (id > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }
  res
    .status(200)
    .json({ status: 'success', data: { tour: '<Updated tour here...>' } });
};

const deleteTour = (req, res) => {
  const id = req.params.id * 1; // * 1 is to convert the string to a number
  if (id > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' }); //404 means not found
  }
  res.status(204).json({ status: 'success', data: null }); //204 means no content
};

// app.get('/api/v1/tours', getAllTours);

// app.post('/api/v1/tours', postTour);

// app.get('/api/v1/tours/:id', createTour);

// app.patch('/api/v1/tours/:id', patchTour);

// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(createTour);
app.route('/api/v1/tours/:id').get(getTour).patch(patchTour).delete(deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
