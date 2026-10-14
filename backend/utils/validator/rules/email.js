class Email 
{
    constructor(messageName = "CT_INVALID_EMAIL")
    {
        this._messageName = messageName;
        this.validator = null;
    }

    set messageName(name)
    {
        this._messageName = name;
    }

    evaluate(target)
    {
        if (typeof target !== 'string') return false;
        const pattern = /^([a-z0-9][a-z0-9_\.-]{0,}[a-z0-9]@[a-z0-9][a-z0-9_\.-]{0,}[a-z0-9][\.][a-z0-9]{2,4})?$/i;
        return pattern.test(target);
    }

    validate(target)
    {
        if (!this.evaluate(target))
        {
            const message = this.validator.i18n.getMessage(this._messageName);
            throw new Error(`${message}: ${target}`);
        }
    }
}

module.exports = Email;