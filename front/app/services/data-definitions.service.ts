import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { openSourceDataDefenitions } from '../../environment/data-definitions/data-defenitions.opensource';

import { IDataDefinition } from '../../environment/data-definitions/data-definitions.interface';

export class DataDefinitionsService implements TranslateLoader {
    // eslint-disable-next-line class-methods-use-this
    getTranslation(): Observable<IDataDefinition> {
        return of(openSourceDataDefenitions);
    }
}
