import { AppMessages, AppStatus, EmptyMessages } from '../constants/constants';
import { remove, render } from '../framework/render';
import { getFilteredPoints } from '../utils/filter-points';
import MessageView from '../views/message-view';

export default class MessagePresenter {
  #appModel = null;
  #pointsModel = null;
  #filterModel = null;
  #tripContainerElement = null;
  #currentMessage = null;
  #messageView = null;

  constructor({ appModel, pointsModel, filterModel, tripContainerElement }) {
    this.#appModel = appModel;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;
    this.#tripContainerElement = tripContainerElement;
  }

  init() {
    this.#appModel.addObserver(this.#handleChange);
    this.#filterModel.addObserver(this.#handleChange);
    this.#pointsModel.addObserver(this.#handleChange);

    this.#updateMessage();
  }

  #handleChange = () => {
    this.#updateMessage();
  };

  #getMessage() {
    if (this.#appModel.appStatus === AppStatus.LOADING) {
      return AppMessages[AppStatus.LOADING];
    }

    if (this.#appModel.appStatus === AppStatus.ERROR) {
      return AppMessages[AppStatus.ERROR];
    }

    if (this.#appModel.openedForm?.type === 'create') {
      return null;
    }

    const filter = this.#filterModel.filter;
    const visiblePoints = getFilteredPoints[filter](
      this.#pointsModel.points
    );

    if (visiblePoints.length > 0) {
      return null;
    }

    return EmptyMessages[filter] ?? 'There are no events now';
  }

  #updateMessage() {
    const message = this.#getMessage();

    if (message === this.#currentMessage) {
      return;
    }

    if (this.#messageView) {
      remove(this.#messageView);
      this.#messageView = null;
    }

    this.#currentMessage = message;

    if (message === null) {
      return;
    }

    this.#messageView = new MessageView({ text: message });
    render(this.#messageView, this.#tripContainerElement);
  }
}
