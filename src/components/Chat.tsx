'use client';

import { ToolName } from '@/models/tools';
import { useChat } from 'ai/react';
import { RestaurantCard } from './RestaurantCard';
import { TimeTable } from "@/components/TimeTable";
import { BookingConfirmation } from "@/components/BookingConfirmation";
import { CancellationConfirmation } from "@/components/CancellationConfirmation";
import { RestaurantMap } from './RestaurantMap';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxSteps: 5,
  });

  console.log(messages);

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(message => (
        <div key={message.id}>
          <div>{message.role === 'user' ? 'User: ' : 'AI: '}</div>
          <div>{message.content}</div>
          <div>
            {message.toolInvocations?.map(toolInvocation => {
              const { toolName, toolCallId, state } = toolInvocation;

              if (state === 'result') {
                if (toolName === ToolName.FindRestaurants) {
                  const { result } = toolInvocation;
                  return (
                    <div key={toolCallId}>
                      <div className="mb-8">
                        <RestaurantMap restaurants={result} />
                      </div>
                      {result.map((restaurant: any) => (
                        <RestaurantCard key={restaurant.id} {...restaurant} />
                      ))}
                    </div>
                  );
                }
                if (toolName === ToolName.ProvideRestaurantInfo) {
                  const { result } = toolInvocation;
                  return (
                    <div key={toolCallId}>{JSON.stringify(result)}</div>
                  );
                }
                if (toolName === ToolName.ProvideTimeTable) {
                  const { result } = toolInvocation;
                  return (
                    <TimeTable
                      key={toolCallId}
                      restaurantName={result.restaurantName}
                      date={result.date}
                      timeSlots={result.timeSlots}
                    />
                  );
                }
                if (toolName === ToolName.BookTable) {
                  const { result } = toolInvocation;
                  return (
                    <BookingConfirmation
                      key={toolCallId}
                      {...result}
                    />
                  );
                }
                if (toolName === ToolName.CancelBooking) {
                  const { result } = toolInvocation;
                  return (
                    <CancellationConfirmation
                      key={toolCallId}
                      {...result}
                    />
                  );
                }
              } else {
                return (
                  <div key={toolCallId}>
                    {toolName === ToolName.FindRestaurants ? (
                      <div>Loading restaurants...</div>
                    ) : null}
                  </div>
                );
              }
            })}
          </div>
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}