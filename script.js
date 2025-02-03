class DiceRoller { 

  constructor() { 

    this.elements = { 

      diceType: document.getElementById('dice-type'), 

      difficulty: document.getElementById('difficulty'), 

      diceCount: document.getElementById('dice-count'), 

      rollDice: document.getElementById('roll-dice'), 

      rollSpecial: document.getElementById('roll-special'), 

      rollFortitude: document.getElementById('roll-fortitude'), 

      historyList: document.getElementById('history-list'), 

      diceDisplay: document.getElementById('dice-display'), 

      results: { 

        superSuccess: document.getElementById('super-success'), 

        success: document.getElementById('success'), 

        failure: document.getElementById('failure'), 

        criticalFailure: document.getElementById('critical-failure'), 

        totalLiquid: document.getElementById('total-liquid') 

      } 

    }; 

 

    this.state = { 

      history: [], 

      specialRollsRemaining: 0, 

      fortitudeRolled: false, 

      powerRolled: false, 

      hasRolledDice: false 

    }; 

 

    this.initEventListeners(); 

    this.createPowerButton(); 

  } 

 

  createPowerButton() { 

    const powerBtn = document.createElement('button'); 

    powerBtn.id = 'roll-power'; 

    powerBtn.className = 'btn warning'; 

    powerBtn.innerHTML = '<i class="fas fa-bolt"></i> Rolar Potência'; 

    powerBtn.disabled = true; 

    document.querySelector('.actions').appendChild(powerBtn); 

    this.elements.rollPower = powerBtn; 

  } 

 

  initEventListeners() { 

    this.elements.rollDice.addEventListener('click', () => this.rollDiceHandler()); 

    this.elements.rollSpecial.addEventListener('click', () => this.rollSpecialHandler()); 

    this.elements.rollFortitude.addEventListener('click', () => this.rollFortitudeHandler()); 

    this.elements.rollPower.addEventListener('click', () => this.rollPowerHandler()); 

     

    document.getElementById('add-dice').addEventListener('click', () => { 

      this.elements.diceCount.value = Math.max(1, parseInt(this.elements.diceCount.value) + 1); 

    }); 

 

    document.getElementById('remove-dice').addEventListener('click', () => { 

      this.elements.diceCount.value = Math.max(1, parseInt(this.elements.diceCount.value) - 1); 

    }); 

 

    document.getElementById('clear-all').addEventListener('click', () => { 

      document.getElementById('admin-password').style.display = 'block'; 

      document.getElementById('admin-password').focus(); 

    }); 

 

    document.getElementById('admin-password').addEventListener('keypress', (e) => { 

      if (e.key === 'Enter' && e.target.value === 'Admin') this.resetGame(); 

    }); 

  } 

 

  rollDice(sides, count) { 

    return Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1); 

  } 

 

  calculateResults(rolls, difficulty) { 

    return rolls.reduce((acc, roll) => { 

      if (roll >= 9 && roll <= 12) acc.superSuccess++; 

      else if (roll >= 6 && roll <= 8) acc.success++; 

      else if (roll >= 2 && roll <= 5) acc.failure++; 

      else if (roll === 1) acc.criticalFailure++; 

       

      acc.totalLiquid += roll >= difficulty ? 1 : 0; 

      return acc; 

    }, { superSuccess:0, success:0, failure:0, criticalFailure:0, totalLiquid:0 }); 

  } 

 

  updateResults(results) { 

    Object.keys(results).forEach(key => { 

      this.elements.results[key].textContent = results[key]; 

    }); 

  } 

 

  updateHistory(rolls) { 

    const entry = document.createElement('li'); 

    entry.textContent = `Rolagem: [${rolls.join(', ')}] - Total: ${rolls.reduce((a,b) => a + b, 0)}`; 

    this.state.history.unshift(entry); 

     

    if (this.state.history.length > 35) { 

      this.state.history.pop().remove(); 

    } 

    this.elements.historyList.prepend(entry); 

  } 

 

  updateDiceDisplay(rolls, sides) { 

    this.elements.diceDisplay.innerHTML = ''; 

    rolls.forEach(roll => { 

      const die = document.createElement('div'); 

      die.className = `die ${sides === 12 ? 'd12' : ''}`; 

      die.textContent = roll; 

      this.elements.diceDisplay.appendChild(die); 

    }); 

  } 

 

  rollDiceHandler() { 

    const sides = parseInt(this.elements.diceType.value); 

    const count = parseInt(this.elements.diceCount.value); 

    const difficulty = parseInt(this.elements.difficulty.value); 

 

    if (count < 1 || isNaN(count)) { 

      alert('Número de dados inválido!'); 

      return; 

    } 

 

    const rolls = this.rollDice(sides, count); 

    const results = this.calculateResults(rolls, difficulty); 

 

    this.updateResults(results); 

    this.updateHistory(rolls); 

    this.updateDiceDisplay(rolls, sides); 

 

    this.state.hasRolledDice = true; 

    this.state.specialRollsRemaining = Math.max(0,  

      rolls.filter(r => r === 12).length -  

      rolls.filter(r => r === 1).length 

    ); 

 

    this.updateButtonStates(); 

  } 

 

  updateButtonStates() { 

    const specialActive = document.getElementById('special').checked; 

    this.elements.rollSpecial.disabled = !specialActive || this.state.specialRollsRemaining <= 0; 

     

    const fortitudeActive = document.getElementById('fortitude').checked; 

    this.elements.rollFortitude.disabled = !fortitudeActive || this.state.fortitudeRolled; 

 

    const powerActive = document.getElementById('power').checked; 

    this.elements.rollPower.disabled = !powerActive || this.state.powerRolled; 

  } 

 

  resetGame() { 

    document.querySelectorAll('input[type="number"]').forEach(input => input.value = input.id === 'difficulty' ? 6 : 1); 

    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => checkbox.checked = false); 

    Object.values(this.elements.results).forEach(el => el.textContent = '0'); 

    this.elements.historyList.innerHTML = ''; 

    this.elements.diceDisplay.innerHTML = ''; 

    this.state = { 

      history: [], 

      specialRollsRemaining: 0, 

      fortitudeRolled: false, 

      powerRolled: false, 

      hasRolledDice: false 

    }; 

    this.updateButtonStates(); 

  } 

} 

 

document.addEventListener('DOMContentLoaded', () => new DiceRoller()); 