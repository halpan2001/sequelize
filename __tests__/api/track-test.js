const frisby = require('frisby');

const { Joi } = frisby;

//Test 1: Track Does Not Exist
//Assert that a 404 status code when track isn't found.
it("should return a status of 404 when the track isn't found", () =>{
  return frisby
    .patch('http://localhost:8000/api/tracks/-1')
    .expect('status', 404);
});

//Test 2: Updating a Track Successfully
//When updating a track succeeds  assert that a 200 status code is returned
//and the track in the response body contains the updated attributes.
it('should return a status of 200 when it successfully updates a track', ()=>{
  return frisby
    .patch('http://localhost:8000/api/tracks/2',{
      name: 'Update Track',
      milliseconds: '20.0',
      unitPrice: '2.0'

    })
    .expect('status', 200);
});


//Test 3:Test 3: Validation Errors
//Create a test with a request body of:
//{"name": "", "milliseconds": "a", "unitPrice": "b"}
//Your test should assert that a 422 status code is returned.

it('should return a status of 422 when it has an invalid input', ()=>{
  return frisby
    .patch('http://localhost:8000/api/tracks/2', {
      name: "",
      milliseconds: "a",
      unitPrice: "b"
    })
    .expect('status', 422);
});

//Also write assertion(s) ... @Luca I couldn't figure out the assertions because
//frisby does not have extensive documentation so I wrote more tests

//validation error message for name
it('should return an error message of "Name is required" when it has an invalid name input', ()=>{
  return frisby
    .patch('http://localhost:8000/api/tracks/2', {
      name: "",
      milliseconds: "2",
      unitPrice: "2"
    })
    .expect('json', 'errors.*', {
      attribute: 'name',
      message: 'Name is required'
    });
});

//validation error message for milliseconds
it('should return an error message of "Milliseconds must be numeric" when it has an invalid name input', ()=>{
  return frisby
    .patch('http://localhost:8000/api/tracks/2', {
      name: "New Name",
      milliseconds: "a",
      unitPrice: "2"
    })
    .expect('json', 'errors.*', {
      attribute: 'milliseconds',
      message: 'Milliseconds must be numeric'
    });
});

//validation error message for unitPrice
it('should return an error message of "unitPrice must be numeric" when it has an invalid name input', ()=>{
  return frisby
    .patch('http://localhost:8000/api/tracks/2', {
      name: "New Name",
      milliseconds: "2",
      unitPrice: "a"
    })
    .expect('json', 'errors.*', {
      attribute: 'unitPrice',
      message: 'Unit price must be numeric'
    });
});
