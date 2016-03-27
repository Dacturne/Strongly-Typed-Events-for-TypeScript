# Strongly Typed Events for TypeScript
Add the power of events to your TypeScript classes (and interfaces).
<img src="http://keestalkstech.com/wp-content/uploads/2016/03/lightning-bolt-1203953_1280-590x332.png" />

## Events are easy!
Events can be added as a gettable property to the class.
```
class PulseGenerator {

	private _onPulsate: EventDispatcher<PulseGenerator, number> = new EventDispatcher<PulseGenerator, number>();

	get onPulsate(): IEvent<PulseGenerator, number> {
		return this._onPulsate;
	}

	pulse(frequencyInHz : number): void {
		this._onPulsate.dispatch(this, this.frequencyInHz);
	}
}
```
Use it:
```
var p = new PulseGenerator();
p.onPulsate.subscribe((sender, hz) => alert(hz));
```

Check the <a href="https://github.com/KeesCBakker/Strongly-Typed-Events-for-TypeScript/blob/master/example.pulse-generator.ts">Pulse Generator example</a> for more details or read: <a href="http://keestalkstech.com/2016/03/strongly-typed-event-handlers-in-typescript-part-1/">Strongly typed event handlers in TypeScript (Part 1)</a>

## Events on interfaces
Interfaces don't have properties that only have getters. That's why events should be implemented using a method:

```
interface IClock {
  onTick(): IEvent<IClock, number>;
}
```

Use it:

```
let clock: IClock = new Clock(5000);
clock.onTick().subscribe((sender, ticks) => alert('Tick-tock #' + ticks));
```

Check the <a href="https://github.com/KeesCBakker/Strongly-Typed-Events-for-TypeScript/blob/master/example.clock.ts">Clock example</a> for more details or read: <a href="http://keestalkstech.com/2016/03/using-strongly-typed-events-in-typescript-with-interfaces-part2/">Using strongly typed events in TypeScript with interfaces (Part 2)</a>


## Need something more robust?
Do you need to handle a lot of events? Use an `EventList` as store for the events. Events will be automatically created.

```
class MyClass {

    private _events: EventList<MyClass, EventArgs> = new EventList<MyClass, EventArgs>();

    get onStart(): IEvent<MyClass, EventArgs> {
        return this._events.get('onStart');
    }

    start(): void {
        this._events.get('onStart').dispatch(this, null);
```
More info? Check: <a href="http://keestalkstech.com/2016/03/strongly-typed-events-in-typescript-using-an-event-list-part-3/">Strongly Typed Events in TypeScript using an event list (Part 3)</a>

## Add named events to your class
Need to add named event support to your class? Implement the `IEventHandling` interface or extend from the abstract `EventHandlingBase` class. 
```
class EventTester implements IEventHandling<EventTester, EventTesterArgs>
{
    private _events: EventList<EventTester, EventTesterArgs> = new EventList<EventTester, EventTesterArgs>();

    subscribe(name: string, fn: (sender: EventTester, args: EventTesterArgs) => void): void {
        this._events.get(name).subscribe(fn);
    }

    unsubscribe(name: string, fn: (sender: EventTester, args: EventTesterArgs) => void): void {
        this._events.get(name).unsubscribe(fn);
    }
}

class EventTesterArgs { }
```
More info? Check: <a href="http://keestalkstech.com/2016/03/adding-named-events-to-your-class-part-4/">Adding named events to your TypeScript classes (Part 4)</a>
