/// <reference types="cypress" />

context('일반게임', () => {
  const 일반버튼_좌표 = [250, 460];
  const 전문가버튼_좌표 = [250, 560];
  const 시작버튼_좌표 = [
    [75, 735], [175, 735], [275, 735], [375, 735], [475, 735]
  ];

  beforeEach(() => {
    cy.on('window:alert', str => {
      expect(str).to.be.equal('광고 보기');
    });

    cy.visit('http://localhost:8080');
  })

  it('첫번째 선택', () => {
    cy.wait(1000);
    cy.get('canvas').click(일반버튼_좌표[0], 일반버튼_좌표[1]);
    cy.wait(1000);
    cy.get('canvas').click(시작버튼_좌표[0][0], 시작버튼_좌표[0][1]);
    cy.wait(1000);
    cy.wait(1300);
  });
  it('두번째 선택', () => {
    cy.wait(1000);
    cy.get('canvas').click(일반버튼_좌표[0], 일반버튼_좌표[1]);
    cy.wait(1000);
    cy.get('canvas').click(시작버튼_좌표[1][0], 시작버튼_좌표[1][1]);
    cy.wait(1000);
    cy.wait(1300);
  });
  it('세번째 선택', () => {
    cy.wait(1000);
    cy.get('canvas').click(일반버튼_좌표[0], 일반버튼_좌표[1]);
    cy.wait(1000);
    cy.get('canvas').click(시작버튼_좌표[2][0], 시작버튼_좌표[2][1]);
    cy.wait(1000);
    cy.wait(1300);
  });
  it('네번째 선택', () => {
    cy.wait(1000);
    cy.get('canvas').click(일반버튼_좌표[0], 일반버튼_좌표[1]);
    cy.wait(1000);
    cy.get('canvas').click(시작버튼_좌표[3][0], 시작버튼_좌표[3][1]);
    cy.wait(1000);
    cy.wait(1300);
  });
  it('다섯번째 선택', () => {
    cy.wait(1000);
    cy.get('canvas').click(일반버튼_좌표[0], 일반버튼_좌표[1]);
    cy.wait(1000);
    cy.get('canvas').click(시작버튼_좌표[4][0], 시작버튼_좌표[4][1]);
    cy.wait(1000);
    cy.wait(1300);
  });
})
