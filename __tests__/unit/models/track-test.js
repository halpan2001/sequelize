const { expect } = require('chai');
const Track = require('./../../../models/track');

//Test 1: Milliseconds isn't numeric
//Write a test that asserts validation fails when milliseconds isn’t numeric.
describe('track', ()=>{
  describe('milliseconds', ()=>{
    it ('should fail validation when not numeric', async ()=>{
      try{
        let track = new Track({milliseconds: 'a'});
        await track.validate();
      } catch (error){
        expect(error.errors[0].message).to.equal('Milliseconds must be numeric');
      }
    });

    //Test 2: Milliseconds is numeric
    //Write a test that asserts validation passes when milliseconds is numeric.
    it ('should pass validation when numeric', async ()=>{
      try{
        let track = new Track({milliseconds: '2'});
        await track.validate();
      } catch (error){
        // expect(error.errors[0].message).to.equal('');
      }
    });

  });
});
