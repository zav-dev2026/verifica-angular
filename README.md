# Verifica Angular

## Scelte nella generazione dell'app

Ho creato l'applicazione da riga di comando, con l'opzione standalone=true;
Quindi se notate la mancanza dei moduli, è per questo motivo, non gestisco un app.module per gli import, nè un modulo per le routes.
I componenti standalone non hanno bisogno di essere dichiarati in un modulo per
essere importati da altri file.

Inoltre i miei componenti risiedono tutti nel file typescript, dato lo scope
dell'applicazione, per comodità ho lavorato nei singoli file.
Quindi i componenti hanno sia la classe, che il template.

## Avviamento dell'app

Dalla root directory dell'applicazione, scaricare le dipendenze col solito comando:

```shell
npm install
```

Per avviarla usare uno di questi seguenti comandi (fanno la stessa cosa):

```shell
npm run start
ng serve
```

## Approccio allo sviluppo dell'applicazione

In questo file readme, illustro il mio ragionamento nella costruzione della app,
non è il massimo a livello di UI ma mi sono concentrato sulla correttezza della logica

Ci sono commenti nel codice che illustrano il funzionamento ma questo è il
documento di riferimento sulle decisioni prese a livello di sviluppo.

Il primo aspetto da considerare come app frontend, è quello di poter rispettare
i contratti con gli endpoint dell'API, quindi si inizia subito a consultare
l'api e i contratti che chiede. Con contratti si intendono ciò che si aspetta
l'api nelle richieste http.

Ad esempio, in una POST dove passiamo i dati necessari per inserire un record
se non rispettiamo il contratto, la chiamata non verrà effettuata a buon fine.
Consideriamo un record di DB che richiede un nome ed un cognome, passando solo il
nome, la chiamata fallirà.
(non è necessariamente il caso di questa applicazione perchè utilizziamo solo la GET,
ma passiamo l'id del personaggio, in questo caso non nel body, ma nella querystring)

### Modello dati

La prima cosa dalla quale partire è chiamare l'api dal browser, testiamo le chiamate
con Swagger(strumento per servire API) e ne analizziamo la risposta.
Entrate nella pagina di swagger, cliccate "try it out" sulla chiamata ed eseguitela.

Con queste chiamate troviamo inanzitutto l'endpoint, dove c'è scritto Curl.
'https://thronesapi.com/api/v2/Characters'
Questo sarà chiamato dal nostro servizio.

Questa è la risposta della GET (isolo un recordo e ne mostro il json)

```json
{
  "id": 0,
  "firstName": "Daenerys",
  "lastName": "Targaryen",
  "fullName": "Daenerys Targaryen",
  "title": "Mother of Dragons",
  "family": "House Targaryen",
  "image": "daenerys.jpg",
  "imageUrl": "https://thronesapi.com/assets/images/daenerys.jpg"
}
```

Partendo da qui, possiamo definire il nostro modello dati nel frontend,
rispettandone la tipizzazione. Quindi così:

```ts
export interface CharacterDTO {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  title: string;
  family: string;
  image: string;
  imageUrl: string;
}
```

##### DTO

Faccio un piccola deviazione di argomento per introdurre il concetto della DTO.
Affrontato in aula, ma non esplicitato nel suo funzionamento, è l'abbreviazione di
Data Transfer Object.
Il suo ruolo è quello di essere il modello di trasferimento dati, che ci viene mandato
dal backend, senza esporre realmente il suo intero aspetto nel database, ma esponendo
solo le informazioni che si ritengono fruibili dal frontend. Diciamo che si tratta
di un'implementazione dell'aspetto della programmazione riguardante l'incapsulamento.

### Modello dati - 2

La potenza del definire il modello dati corrispondente da subito, è la possibilità
di farsi aiutare nell'autocompletamento dalla IDE. (Integrated Developer Enviroment es: VS code)

#### All'interno del servizio

La primissima dimostrazione di questo, è la chiamata http GET.

```ts
  getAllCharacters(): Promise<CharacterDTO[]> {
    return firstValueFrom(this.http.get<CharacterDTO[]>(`${this.baseUrl}`));
  }
```

Nel momento in cui io dichiaro il tipo di dato che mi aspetto dal backend ed esso
corrisponde esattamente, non devo effettuare mappature di modelli di dati manualmente.

Questa cosa è gestita automaticamente, il framework riesce ad assegnare alle proprietà
di questa interfaccia "CharacterDTO" i valori del json ricevuto.
(In questo caso, una Promise di un array di characters)

#### All'interno dei componenti

Posso dichiarare anche una proprietà delle classi componente, contenente il tipo di dato che riceviamo dall'API.

character-list component:

```ts
export class CharacterList {
  public characterList: CharacterDTO[] = [];
}
```

e ne possiamo usare le proprietà nel template. (dimostro dopo sul componente
del singolo personaggio)

### Da Lista a Singolo

Come passare delle informazioni da un componente genitore al componente figlio?
con @Input

Si dichiara una proprietà che verrà ricevuta come input nel componente figlio

character component:

```ts
export class Character {
  @Input() character: CharacterDTO | null = null;
}
```

e dal componente genitore si passa tramite il property binding, quindi fra
parentesi quadre il nome della proprietà [character]="proprietà del genitore"

in questo caso viene passata nel template, in un ciclo @for che cicla l'array di
CharacterDTO, di conseguenza passa il singolo modello dati character al componente character.

character component template:

```html
@for (character of characterList; track character.id) {
<div class="col">
  <app-character [character]="character"></app-character>
</div>
}
```

La proprietà @Input() character del figlio riceve il character del ciclo for.
Ribadisco, fra quadre è la proprietà del figlio, negli apici è la variabile
ciclata dall'array del componente genitore.

## Inizializzazione dei componenti

Nel momento in cui un componente necessita di ricevere delle informazioni
da un API e dobbiamo renderizzarlo, ovviamente dobbiamo gestire questa cosa
in maniera tale da poter mostrare le informazioni dopo che abbiamo ricevuto
la risposta e non prima.

Come fare?

Semplice, ci agganciamo ad un component life cycle hook.
Angular ci permette di eseguire funzioni durante il ciclo vitale dei
componenti, in questo caso sfruttiamo l'inizializzazione (ciò succede prima del render)

Quindi dichiaro che la classe implementa OnInit (dimostro su CharacterList)

```ts
export class CharacterList implements OnInit
```

e dichiaro anche il metodo ereditato dalla classe OnInit

```ts
  async ngOnInit(): Promise<void> {
    try {
      const result = await this.characterService.getAllCharacters();
      this.characterList = result;
    } catch {
      throw 'Errore nel recupero dei personaggi';
    }
  }
```

in un blocco try catch risolvo la promise che ottengo dal servizio, se con successo
assegno alla proprietà della classe this.characterList il risultato.

chiamando il servizio this.characterService, al quale posso accedere poichè iniettato con DI (dependency injection), in questo caso nel costruttore:

```ts
 constructor(private characterService: CharacterService) {}
```

## Da Lista/Singolo a Dettaglio

Adesso entra in gioco il routing, dobbiamo usare [routerLink] e il relativo
import, per simulare il filesystem all'interno della nostra single page application.

Ciò avviene tramite la dichiarazione delle rotte inanzitutto:

```ts
export const routes: Routes = [
  { path: '', component: CharacterList },
  { path: 'characters/:id', component: CharacterDetails },
  { path: '**', redirectTo: '' },
];
```

in app.routes.ts

dove ":id" in "characters/:id" è il placeholder di un valore ricevuto che andremo a popolare.

all'interno del componente del singolo character, passo il suo id, nel template
al [routerLink] che navigherà come dichiarato nelle rotte, al componente
CharacterDetails.

character component template:

```html
<a [routerLink]="'/characters/' + character.id">
  <div [class]="character.family">
    <h5 class="card-title">{{ character.fullName }}</h5>
  </div>
</a>
```

Come potete vedere, qui navigo sul /characters/ + id ricevuto dal componente padre duranto il ciclo for.

Inoltre vi ricordo che si può mostrare una proprietà della classe nel template attraverso
l'interpolazione

{{ nome proprietà }}

Anche qui entra in gioco la definizione del modello che abbiamo fatto all'inizio.
Potrei tranquillamente scrivere character.fullName, ma avendone dichiarato il tipo
l'IDE mi può aiutare con la tab autocompletion, nel momento in cui scrivo "character."
dopo il punto mi viene suggerita la lista della sue proprietà, e quindi ho comodità di lavoro.

### Implementazione del dettaglio

Allora qui si potrebbe benissimo propagare l'informazione del dettaglio da un
componente padre, nel mio caso ho voluto dimostrare di saper gestire più di una
chiamata API, e quindi ho definito nel servizio la GetCharacterById().

Quindi come nella lista, avendo necessità di ricevere l'informazione e di mostrarla
prima del render, implementiamo onInit e nella sua funzione ngOnit() fetchiamo
il dato dall'API.

character-details component:

```ts
  async ngOnInit(): Promise<void> {
    this.characterId = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.characterId) {
      try {
        const result = await this.characterService.getCharacterById(this.characterId);
        this.character = result;
      } catch {
        throw 'Errore nel recupero del personaggio';
      }
    }
  }
```

ritroviamo l'id dall'url tramite ActivatedRoute.

Dopodichè chiamiamo l'api dal servizio passando l'id come parametro della funzione.

Scrivo il resto della logica nei commenti di documentazione sui componenti stessi.
Se avete altri dubbi o domande, sapete dove scrivermi!
