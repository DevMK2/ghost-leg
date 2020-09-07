/// <reference types="cypress" />

context('일반게임', () => {
  const 일반버튼_좌표 = [100, 200];
  const 전문가버튼_좌표 = [100, 400];
  const 시작버튼_좌표 = [
    [70, 730], [170, 730], [270, 730], [370, 730], [470, 730]
  ];

  beforeEach(() => {
    cy.on('window:alert', str => {
      expect(str).to.be.equal('광고 보기');
    });

    cy.visit('http://localhost:8080');
  })

  it('첫번째 선택', () => {
    cy.get('canvas').click(일반버튼_좌표[0], 일반버튼_좌표[1]);
    cy.wait(100);
    cy.get('canvas').click(시작버튼_좌표[0][0], 시작버튼_좌표[0][1]);
    cy.wait(100);
    cy.wait(1300);
  });
  it('두번째 선택', () => {
    cy.get('canvas').click(일반버튼_좌표[0], 일반버튼_좌표[1]);
    cy.wait(100);
    cy.get('canvas').click(시작버튼_좌표[1][0], 시작버튼_좌표[1][1]);
    cy.wait(100);
    cy.wait(1300);
  });
  it('세번째 선택', () => {
    cy.get('canvas').click(일반버튼_좌표[0], 일반버튼_좌표[1]);
    cy.wait(100);
    cy.get('canvas').click(시작버튼_좌표[2][0], 시작버튼_좌표[2][1]);
    cy.wait(100);
    cy.wait(1300);
  });
  it('네번째 선택', () => {
    cy.get('canvas').click(일반버튼_좌표[0], 일반버튼_좌표[1]);
    cy.wait(100);
    cy.get('canvas').click(시작버튼_좌표[3][0], 시작버튼_좌표[3][1]);
    cy.wait(100);
    cy.wait(1300);
  });
  it('다섯번째 선택', () => {
    cy.get('canvas').click(일반버튼_좌표[0], 일반버튼_좌표[1]);
    cy.wait(100);
    cy.get('canvas').click(시작버튼_좌표[4][0], 시작버튼_좌표[4][1]);
    cy.wait(100);
    cy.wait(1300);
  });
})
