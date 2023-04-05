import { badRequest } from '../../../helpers/http/http-helper'
import { unauthorized } from '../../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, Validation } from './add-survey-controller-protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const validate = await this.validation.validate(httpRequest.body)
    if (validate) {
      return badRequest(validate)
    }
    return unauthorized()
  }
}
