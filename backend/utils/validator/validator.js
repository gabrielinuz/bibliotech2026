const i18n = require('../i18n/i18n');

class Validator 
{
    constructor()
    {
        this.i18n = i18n;
        this._target = null;
    }

    /**
     * 
     * @param {*} target es el objeto objetivo, es lo que se va a evaluar.
     * @param {*} ruleObject es el objeto rule, la regla, quien va a evaluar.
     * @returns un booleano.
     */
    isValid(target, ruleObject)
    {
        return ruleObject.evaluate(target);
    }

/**
 * 
 * @abstract Estos dos métodos a continuación se usan combinados y la
 * diferencia con isValid es que lanzan una excepción y 
 * retornan un mensaje con soporte multi-idioma.
 * Uso: 
 *      validator.validateThis("contacto@ejemplo.com").with(new Email());
 */
    validateThis(target)
    {
        this._target = target;
        return this;
    }

    // Delegación y composición: Validator actúa como Visitante
    with(ruleObject)
    {
        ruleObject.validator = this; //línea clave, acá está el visitor
        ruleObject.validate(this._target);
        return this;
    }
}

module.exports = Validator;