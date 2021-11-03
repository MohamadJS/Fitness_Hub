      // Example starter JavaScript for disabling form submissions if there are invalid fields
      (function () {
        'use strict'
      
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        const forms = document.querySelectorAll('.validated-form')
      
        // Loop over them and prevent submission
        // Turns it into an array
        // Make an array from this querySelector
        Array.from(forms)
        // Old way of making an array 
        //Array.prototype.slice.call(forms)
          // Loop over the array
          .forEach(function (form) {
              // Add an event listener for each form
            form.addEventListener('submit', function (event) {
              if (!form.checkValidity()) {
                  // if form is not valid, prevent it from submitting
                event.preventDefault()
                event.stopPropagation()
              }
      
              form.classList.add('was-validated')
            }, false)
          })
      })()