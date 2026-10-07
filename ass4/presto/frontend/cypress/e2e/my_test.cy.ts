describe('user alternate path', () => {
  const email = 'test2@example.com';
  const password = 'password';
  const name = 'Test User';

  const login = () => {
    cy.session('userSession', () => {
      cy.visit('http://localhost:3000/login');
      cy.get('input[name="email"]').type(email);
      cy.get('input[name="password"]').type(password);
      cy.get('button[name="login-submit-button"]').click();
    });
  };

  const presentationName = 'Test Presentation';
  const description = 'This is a test presentation';

  const createNewPresentation = () => {
    cy.get('button[name="new-presentation-button"]').click();
    cy.get('input[name="name"]').type(presentationName);
    cy.get('input[name="description"]').type(description);
    cy.get('button[name="create-button"]').click();
  }

  const deletePresentation = () => {
    cy.get('button[name="delete-button"]').click();
    cy.get('button[name="delete-yes-button"]').click();
  }

  it('should register successfully', () => {
    cy.visit('http://localhost:3000/register');
    cy.get('input[name="name"]').type(name);
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('input[name="confirm-password"]').type(password);
    cy.get('button[name="register-button"]').click();
    cy.url().should('include', '/dashboard');
  });

  it('should delete a single slide successfully', () => {
    login();
    cy.visit('http://localhost:3000/dashboard');
    createNewPresentation();
    cy.contains(presentationName).click();
    cy.get('button[name="create-slide-button"]').click();
    cy.get('button[name="create-slide-button"]').click();
    cy.get('button[name="create-slide-button"]').click();
    cy.contains('p', 'Slide 4 of 4').should('be.visible');

    cy.get('button[name="delete-slide-button"]').click();
    cy.contains('p', 'Slide 3 of 3').should('be.visible');

    deletePresentation();
  });

  it('should open the preview of the presentation in a new tab', () => {
    login();
    cy.visit('http://localhost:3000/dashboard');
    createNewPresentation();
    cy.contains(presentationName).click();

    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });

    cy.get('button[name="preview-button"]').click();

    cy.get('@windowOpen').should(
      'have.been.calledWithMatch',
      /\/preview\/.*\/slide\/1/
    );
    deletePresentation();
  });

  it('should create a text element on a slide successfully', () => {
    login();
    cy.visit('http://localhost:3000/dashboard');
    createNewPresentation();
    cy.contains(presentationName).click();

    cy.get('button[name="text-button"]').click();
    cy.get('[contenteditable="true"]').should('exist');

    deletePresentation();
  });

  it('should create a code element on a slide successfully', () => {
    login();
    cy.visit('http://localhost:3000/dashboard');
    createNewPresentation();
    cy.contains(presentationName).click();

    cy.get('button[name="code-button"]').click();
    cy.get('dialog[open]').should('be.visible');

    cy.get('input[name="codeWidth"]').type('50');
    cy.get('input[name="codeHeight"]').type('50');
    cy.get('input[name="codeFontSize"]').type('1');
    cy.get('textarea').type('console.log("Hello World");');

    cy.get('dialog[open]')
        .find('button[name="create-button"]')
        .click();
    cy.get('dialog[open]').should('not.exist');

    cy.get('code').should('exist');
    deletePresentation();
  });

  it('should edit a shape element on a slide successfully', () => {
    login();
    cy.visit('http://localhost:3000/dashboard');
    createNewPresentation();
    cy.contains(presentationName).click();
    cy.get('button[name="shape-button"]').click();
    cy.get('.bg-orange-400').dblclick({ force: true });

    cy.get('input[name="width"]').should('be.visible');
    cy.get('input[name="height"]').should('be.visible');
    cy.get('input[name="posX"]').should('be.visible');
    cy.get('input[name="posY"]').should('be.visible');
    cy.get('button[name="save-button"]').should('be.visible');

    cy.get('input[name="width"]').focus().clear().type('60');
    cy.get('input[name="height"]').focus().clear().type('40');
    cy.get('input[name="posX"]').focus().clear().type('20');
    cy.get('input[name="posY"]').focus().clear().type('30');

    cy.get('button[name="save-button"]').click();
    cy.get('.bg-orange-400').should('exist');

    deletePresentation();
  });

  it('should delete an element from a slide successfully', () => {
    login();
    cy.visit('http://localhost:3000/dashboard');
    createNewPresentation();
    cy.contains(presentationName).click();
    cy.get('button[name="shape-button"]').should('be.visible').click();

    cy.get('.bg-orange-400').then(($shapes) => {
      cy.get('.bg-orange-400').first().rightclick({ force: true });
      cy.get('#context-menu-delete').should('be.visible').click({ force: true });

      cy.get('.bg-orange-400').should('not.exist');
    });

    deletePresentation();
  });
});
