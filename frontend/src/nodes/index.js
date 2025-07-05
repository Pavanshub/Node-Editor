import BaseNode from './BaseNode';
import InputNode from './InputNode';
import OutputNode from './OutputNode';
import LLMNode from './LLMNode';
import TextNode from './TextNode';
import FilterNode from './FilterNode';
import TransformNode from './TransformNode';
import AggregateNode from './AggregateNode';
import ConditionalNode from './ConditionalNode';
import DelayNode from './DelayNode';

export const nodeTypes = {
  baseNode: BaseNode,
  inputNode: InputNode,
  outputNode: OutputNode,
  llmNode: LLMNode,
  textNode: TextNode,
  filterNode: FilterNode,
  transformNode: TransformNode,
  aggregateNode: AggregateNode,
  conditionalNode: ConditionalNode,
  delayNode: DelayNode,
};