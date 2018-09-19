import { Request, Response, Router } from 'express';

class ErrorPathClass {
    public router: Router;
    public errorCache: Error[];

    constructor() {
        this.router = Router();
        this.errorCache = [];

        this.router.get('/', this.handle.bind(this));
    }

    public add(err: Error) {
        if (this.errorCache.length > 10) {
            this.errorCache.pop();
        }

        return this.errorCache.push(err);
    }

    /**
     * Returns the error cache
     *
     * @private
     * @param {Request} req
     * @param {Response} res
     * @memberof ErrorPathClass
     */
    private handle(req: Request, res: Response) {
        if (this.errorCache.length === 0) {
            return res.send('No errors.')
        }
        return res.send(this.errorCache);
    }

}

export const ErrorCache = new ErrorPathClass();
export const ErrorPath = ErrorCache.router;
