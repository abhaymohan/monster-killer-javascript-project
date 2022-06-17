const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "STRONG_ATTACK";
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';

const enteredvalue = prompt("enter the initial life of player and monster", '100');

let chosenMaxLife = parseInt(enteredvalue); // maxlife for both monster and player later taken by user


if(isNaN(chosenMaxLife) || chosenMaxLife <= 0)
{
    chosenMaxLife = 100;
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;
let battleLog = [];

adjustHealthBars(chosenMaxLife);

function writeToLog(event, value, monsterHealth, playerHealth)
{
    let logEntry;
    if(event === LOG_EVENT_PLAYER_ATTACK)
    {
        logEntry = {
            event,
            value,
            target : 'MONSTER',
            attack : 'PLAYER ATTACK',
            finalMonsterHealth : monsterHealth,
            finalPlayerHealth : playerHealth
        }
    }else if (event === LOG_EVENT_PLAYER_STRONG_ATTACK){
        logEntry = {
            event,
            value,
            target : 'MONSTER',
            attack : 'PLAYER STRONG ATTACK',
            finalMonsterHealth : monsterHealth,
            finalPlayerHealth : playerHealth
        };
    } else if(event === LOG_EVENT_MONSTER_ATTACK){
        logEntry = {
            event,
            value,
            target : 'MONSTER',
            attack : 'MONSTER ATTACK',
            finalMonsterHealth : monsterHealth,
            finalPlayerHealth : playerHealth
        };
    }else if(event === LOG_EVENT_PLAYER_HEAL){
        logEntry = {
            event,
            value,
            target : 'MONSTER',
            attack : 'PLAYER HEAL',
            finalMonsterHealth : monsterHealth,
            finalPlayerHealth : playerHealth
        };
    }else if(event === LOG_EVENT_GAME_OVER){
        logEntry = {
            event,
            value,
            finalMonsterHealth : monsterHealth,
            finalPlayerHealth : playerHealth
        };
    }

    battleLog.push(logEntry);

}

function reset(){
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}

function endRound()
{
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;
    writeToLog(LOG_EVENT_MONSTER_ATTACK,playerDamage,currentMonsterHealth,currentPlayerHealth);



    if(currentPlayerHealth <= 0 && hasBonusLife === true)
    {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        alert("hey bonus life saved you !");
        setPlayerHealth(initialPlayerHealth);
    }

    if(currentMonsterHealth <= 0 && currentPlayerHealth > 0)
    {
        alert('you won');
        writeToLog(LOG_EVENT_GAME_OVER,'PLAYER WON', currentMonsterHealth, currentPlayerHealth);
        reset();
    }
    else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0)
    {
        alert('monster won');
        writeToLog(LOG_EVENT_GAME_OVER,'MONSTER WON', currentMonsterHealth, currentPlayerHealth);
        reset();
    }
    else if(currentMonsterHealth <= 0 && currentPlayerHealth <= 0)
    {
        alert('draw');
        writeToLog(LOG_EVENT_GAME_OVER,'A DRAW', currentMonsterHealth, currentPlayerHealth);
        reset();
    }
}
 
function attackMonster(mode)
{
    const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
    const logEvent = mode === MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK;
    
    // changed below logic to ternary operator
    /*if(mode === MODE_ATTACK)
    {
        maxDamage = ATTACK_VALUE;
        logEvent = LOG_EVENT_PLAYER_ATTACK;   
    }
    else
    {
        maxDamage = STRONG_ATTACK_VALUE;
        logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
    }*/

    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;
    writeToLog(logEvent,damage, currentMonsterHealth, currentPlayerHealth);
    endRound();

}

function attackHandler()
{
    attackMonster(MODE_ATTACK);
}

function strongAttackHandler()
{
  attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler()
{
    let healValue;
    if(currentPlayerHealth >= chosenMaxLife - HEAL_VALUE)
    {
        alert("You can't heal to more than your max initial health.");
        healValue = chosenMaxLife - currentPlayerHealth;
    }else{
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(HEAL_VALUE);
    currentPlayerHealth += HEAL_VALUE;
    writeToLog(LOG_EVENT_PLAYER_HEAL,healValue, currentMonsterHealth, currentPlayerHealth);
    endRound();
    
}

function printLogHandler()
{
    console.log(battleLog);
}

attackBtn.addEventListener('click',attackHandler);
strongAttackBtn.addEventListener('click',strongAttackHandler);
healBtn.addEventListener('click',healPlayerHandler);
logBtn.addEventListener('click', printLogHandler);