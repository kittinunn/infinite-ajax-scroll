let ias;

describe('Scroll', () => {
  beforeEach(() => {
    // runs before each test in the block
    cy.visit('http://localhost:8080/test/fixtures/default/page1.html')

    cy.InfiniteAjaxScroll().then((InfiniteAjaxScroll) => {
      ias = new InfiniteAjaxScroll('.blocks', {
        item: '.blocks__block',
      });
    });
  });

  it('should emit a scrolled event when scrolled down', () => {
    const spy = {
      scrolled() {}
    };

    cy.spy(spy, 'scrolled');

    ias.on('scrolled', spy.scrolled);

    cy.scrollTo('bottom', {duration: 300}).then(function() {
      expect(spy.scrolled).to.have.been.calledWith(
          Cypress.sinon.match(function(event) {
            expect(event.scroll.y).to.be.greaterThan(0, 'scroll.y');
            expect(event.scroll.x).to.be.equal(0, 'scroll.x');
            expect(event.scroll.deltaY).to.be.greaterThan(0, 'scroll.deltaY');
            expect(event.scroll.deltaX).to.be.equal(0, 'scroll.deltaX');

            return true;
          })
      );
    });
  });

  it('should emit a scrolled event when scrolled up', () => {
    const spy = {
      scrolled() {}
    };

    // first scroll down
    cy.scrollTo('bottom', {duration: 300}).then(function() {
      cy.spy(spy, 'scrolled');

      ias.on('scrolled', spy.scrolled);

      cy.scrollTo('top', {duration: 300}).then(function() {
        expect(spy.scrolled).to.have.been.calledWith(
            Cypress.sinon.match(function(event) {
              expect(event.scroll.y).to.be.greaterThan(0, 'scroll.y');
              expect(event.scroll.x).to.be.equal(0, 'scroll.x');
              expect(event.scroll.deltaY).to.be.lessThan(0, 'scroll.deltaY');
              expect(event.scroll.deltaX).to.be.equal(0, 'scroll.deltaX');

              return true;
            })
        );
      });
    });
  });

  it('should emit a hit event when scrolled to bottom', () => {
    const spy = {
      hit() {}
    };

    cy.spy(spy, 'hit');

    ias.on('hit', spy.hit);

    cy.scrollTo('bottom', {duration: 300});

    cy.wait(200).then(() => {
      expect(spy.hit).to.have.been.called;
    });
  });

  it('should not emit a hit event when unbinded', () => {
    const spy = {
      hit() {}
    };

    cy.spy(spy, 'hit');

    ias.on('hit', spy.hit);

    ias.unbind();

    cy.scrollTo('bottom', {duration: 300});

    cy.wait(200).then(() => {
      expect(spy.hit).to.not.have.been.called;
    });
  });
});
