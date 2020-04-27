#pragma once
#include <iostream>
#include <fstream>
#include <limits>
#include <vector>
#include <stack>
#include <queue>

using int_pair = std::pair<size_t, size_t>;
using i_f_pair = std::pair<size_t, double>;
using float_pair = std::pair<double, double>;
using std::vector;

//graph
// vector<size_t> fixed_objects; // firestations, hospitals, burger kings
// vector<size_t> no_fixed_objects; // homes
constexpr size_t infinty = std::numeric_limits<size_t>::max();
constexpr double double_infinty = std::numeric_limits<double>::max();

template <class t>
inline t max_value(const t a, const t b)
{
	return a > b ? a : b;
}

template <class t>
inline t min_value(const t a, const t b)
{
	return a < b ? a : b;
}

struct graph_t
{
	vector<vector<i_f_pair>> edges; // vertex; distance
	vector<vector<i_f_pair>> r_edges;
	vector<float_pair> coords;
	size_t size;
};
//

inline vector<double> dijkstra(const vector<vector<i_f_pair>>& graph, const size_t start)
{
	size_t n = graph.size();

	vector<double> distance(n, infinty);
	auto f = [](i_f_pair x, i_f_pair y)
	{
		return x.second > y.second;
	};
	std::priority_queue<i_f_pair, vector<i_f_pair>, decltype(f)> q(f);
	// vertex; distance
	q.push({ start, 0 });

	while (!q.empty())
	{
		auto vertex = q.top();
		q.pop();
		if (distance[vertex.first] < infinty) // vertex already used
			continue;
		distance[vertex.first] = vertex.second;
		for (auto& u : graph[vertex.first])
			if (distance[u.first] == infinty)
				q.push({ u.first, vertex.second + u.second });
	}
	return distance;
}

inline vector<i_f_pair> dijkstra_path(const vector<vector<i_f_pair>>& graph, const size_t start)
{
	size_t n = graph.size();

	vector<i_f_pair> distance(n, i_f_pair(infinty, infinty)); // from, dist
	auto f = [](std::pair<int_pair, double> x, std::pair<int_pair, double> y)
	{
		return x.second > y.second;
	};
	std::priority_queue<std::pair<int_pair, double>, vector<std::pair<int_pair, double>>, decltype(f)> q(f);
	// vertex(from, to); distance
	q.push({ {start, start}, 0 });

	while (!q.empty())
	{
		auto vertex = q.top();
		q.pop();
		if (distance[vertex.first.second].second < infinty) // vertex already used
			continue;
		distance[vertex.first.second] = i_f_pair(vertex.first.first, vertex.second);
		for (auto& u : graph[vertex.first.second])
			if (distance[u.first].second == infinty)
				q.push({ {vertex.first.second, u.first}, vertex.second + u.second });
	}

	return distance;
}

inline vector<vector<int>> floyd() // matrix smezhnosty (-1 : path doesnt exist)
{
	// reading
	size_t n;
	std::cin >> n;
	vector<vector<int>> matrix(n, vector<int>(n));
	for (size_t i = 0; i < n; ++i)
		for (size_t j = 0; j < n; ++j)
			std::cin >> matrix[i][j];
	//

	for (size_t k = 0; k < n; ++k)
		for (size_t i = 0; i < n; ++i)
			for (size_t j = 0; j < n; ++j)
				matrix[i][j] = min_value(matrix[i][j], matrix[i][k] + matrix[k][j]);
	return matrix;
}

inline graph_t read_data(const char* file_name)
{
	size_t n, e;
	std::ifstream in(file_name);
	in >> n >> e;
	graph_t graph;
	graph.size = n;
	graph.edges = vector<vector<i_f_pair>>(n);
	graph.coords = vector<float_pair>(n);
	for (size_t i = 0; i < e; ++i)
	{
		size_t v, u;
		double d;
		in >> v >> u >> d;
		graph.edges[v].push_back({ u, d });
	}
	for (size_t i = 0; i < n; ++i)
	{
		double x, y;
		in >> x >> y;
		graph.coords[i] = { x, y };
	}
	in.close();
	return graph;
}

inline void reverse_graph(graph_t& graph)
{
	graph.r_edges = vector<vector<i_f_pair>>(graph.size);
	for (size_t i = 0; i < graph.size; ++i)
		for (size_t j = 0; j < graph.edges[i].size(); ++j)
			graph.r_edges[graph.edges[i][j].first].push_back({ i, graph.edges[i][j].second });
}

inline double lenght_tree_of_shortest_path(const vector<i_f_pair>& distance, vector<size_t> objects)
{
	vector<bool> used(distance.size(), false);
	double lenght = 0;
	std::stack<size_t> stack;
	for (size_t v : objects)
		stack.push(v);
	while (!stack.empty())
	{
		size_t v = stack.top();
		stack.pop();
		if (used[v])
			continue;
		used[v] = true;
		lenght += distance[v].second;
		if (distance[v].first == infinty)
			return infinty;
		stack.push(distance[v].first);
	}
	return lenght;
}

inline vector<int_pair> tree_of_shortest_path(const vector<i_f_pair>& distance, vector<size_t> objects)
{
	vector<int_pair> tree;
	vector<bool> used(distance.size(), false);
	std::stack<size_t> stack;
	for (size_t v : objects)
		stack.push(v);
	while (!stack.empty())
	{
		size_t v = stack.top();
		stack.pop();
		if (used[v])
			continue;
		used[v] = true;
		stack.push(distance[v].first);
		tree.push_back({ distance[v].first , v });
	}
	return tree;
}

inline std::pair<vector<int_pair>, double> length_and_tree_of_shortest_path(const vector<i_f_pair>& distance, vector<size_t> objects)
{
	vector<bool> used(distance.size(), false);
	double lenght = 0;
	vector<int_pair> tree;
	std::stack<size_t> stack;
	for (size_t v : objects)
		stack.push(v);
	while (!stack.empty())
	{
		size_t v = stack.top();
		stack.pop();
		if (used[v])
			continue;
		if (distance[v].first == infinty)
			lenght = infinty;
		used[v] = true;
		lenght += distance[v].second;
		stack.push(distance[v].first);
		tree.push_back({ distance[v].first , v });
	}
	return std::pair<vector<int_pair>, double>(tree, lenght);
}

inline double dist(float_pair l, float_pair r)
{
	return (l.first - r.first) * (l.first - r.first) + (l.second - r.second) * (l.second - r.second);
}
inline size_t get_nearest_vertex(float_pair vec, const graph_t& graph)
{
	double distance = std::numeric_limits<double>::max();
	size_t res = 0;
	for (size_t i = 0; i < graph.size; ++i)
	{
		double cur_dist = dist(vec, graph.coords[i]);
		if (distance > cur_dist)
		{
			distance = cur_dist;
			res = i;
		}
	}
	return res;
}

inline float_pair operator*(float_pair l, float_pair r)
{
	return float_pair(l.first * r.first, l.second * r.second);
}
inline float_pair operator+(float_pair l, float_pair r)
{
	return float_pair(l.first + r.first, l.second + r.second);
}
inline float_pair operator/(float_pair p, double d)
{
	return float_pair(p.first / d, p.second / d);
}
inline float_pair operator*(float_pair p, double d)
{
	return float_pair(p.first * d, p.second * d);
}

inline int_pair nearest_clusters(const vector<float_pair>& centroides)
{
	double min = std::numeric_limits<double>::max();
	int_pair res;
	for (size_t i = 0; i < centroides.size(); ++i)
		if (centroides[i].first > 0)
			for (size_t j = i + 1; j < centroides.size(); ++j)
			{
				if (centroides[j].first < 0)
					continue;
				double cur = dist(centroides[i], centroides[j]);
				if (cur < min)
				{
					min = cur;
					res.first = i;
					res.second = j;
				}
			}
	return res;
}

inline auto clustering(size_t k, const vector<size_t>& no_fixed_objects, const graph_t& graph)
{
	vector<vector<size_t>> clusters(no_fixed_objects.size(), vector<size_t>(1));
	vector<float_pair> centroides(no_fixed_objects.size());

	for (size_t i = 0; i < no_fixed_objects.size(); ++i)
	{
		clusters[i][0] = no_fixed_objects[i];
		centroides[i] = graph.coords[no_fixed_objects[i]];
	}

	while (clusters.size() > k)
	{
		auto pair = nearest_clusters(centroides);
		centroides[pair.first] = (centroides[pair.first] * clusters[pair.first].size() +
			centroides[pair.second] * clusters[pair.second].size()) / (clusters[pair.first].size() + clusters[pair.second].size());

		for (auto node : clusters[pair.second])
			clusters[pair.first].push_back(node);

		clusters.erase(clusters.begin() + pair.second);
		centroides.erase(centroides.begin() + pair.second);
	}
	return std::pair<vector<vector<size_t>>, vector<float_pair>>(clusters, centroides);
}

inline void clustering(size_t k, const vector<size_t>& no_fixed_objects,
	const graph_t& graph, const char* out_file)
{
	vector<vector<size_t>> clusters(no_fixed_objects.size(), vector<size_t>(1));
	vector<vector<int_pair>> dendrogramma(no_fixed_objects.size());
	vector<float_pair> centroides(no_fixed_objects.size());

	for (size_t i = 0; i < no_fixed_objects.size(); ++i)
	{
		clusters[i][0] = no_fixed_objects[i];
		centroides[i] = graph.coords[no_fixed_objects[i]];
	}
	size_t i = 1;
	for( size_t j = k; j < clusters.size(); ++j)
	{
		auto pair = nearest_clusters(centroides);
		centroides[pair.first] = (centroides[pair.first] * clusters[pair.first].size() +
			centroides[pair.second] * clusters[pair.second].size()) / (clusters[pair.first].size() + clusters[pair.second].size());

		for (auto node : clusters[pair.second])
			clusters[pair.first].push_back(node);

		clusters[pair.second].clear();
		centroides[pair.second] = { -1.0, -1.0 };
		dendrogramma[pair.first].push_back({ pair.second, i });
		++i;
	}
	std::ofstream out(out_file);
	out << k << std::endl;
	for (auto& cluster : clusters)
		if (cluster.size() != 0)
		{
			out << cluster.size() << ' ';
			for (size_t v : cluster)
				out << v << ' ';
			out << std::endl;
		}
	for (float_pair center : centroides)
		if (center.first > 0)
			out << center.first << ' ' << center.first << '\n';
	out << std::endl;
	for (size_t i =0; i < dendrogramma.size();++i )
	if (dendrogramma[i].size()!=0){
out << i << ' ';
		for (int_pair who_step : dendrogramma[i])
			out << who_step.first << ' ' << who_step.second << ' ';
		out << std::endl;
	}
}

inline vector<size_t> get_centroids(const vector<float_pair>& centroides, const graph_t& graph)
{
	vector<size_t> res(centroides.size(), 0);
	for (size_t i = 0; i < centroides.size(); ++i)
		res[i] = get_nearest_vertex(centroides[i], graph);
	return res;
}
